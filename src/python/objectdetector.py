import imutils
import time

import videowriter
from person_counter import PersonCounter
from config import *

import hud
import voice_commands

import cv2

cam = cv2.VideoCapture(0)
margin_x = 60
margin_y = 160


class ObjectDetector:
    def __init__(self, min_area=10):
        self.color_lower = (1, 150, 150)
        self.color_upper = (40, 240, 255)
        self.min_area = min_area

    def detect(self, frame):
        hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
        mask = cv2.inRange(hsv, self.color_lower, self.color_upper)
        mask = cv2.erode(mask, None, iterations=2)
        mask = cv2.dilate(mask, None, iterations=2)

        _, contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL,
                                          cv2.CHAIN_APPROX_SIMPLE)

        try:
            contour = sorted(contours, key=cv2.contourArea, reverse=True)[0]
            if cv2.contourArea(contour) < self.min_area:
                contour = None
        except IndexError:
            contour = None

        #cv2.imshow("ojbect", mask)

        return contour


class FaceDetector:
    def __init__(self, scale=1.25, num=3):
        self.cascade = cv2.CascadeClassifier('/usr/share/opencv/haarcascades/haarcascade_frontalface_default.xml')
        self.scale = scale
        self.num = num

    def detect(self, frame):
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        rois = self.cascade.detectMultiScale(gray, self.scale, self.num)
        return rois


def get_region(marker):
    x1, y1, w, h = marker
    x1 -= margin_x
    y1 -= margin_y
    x2 = x1 + w + 2 * margin_x
    y2 = y1 + h + margin_y
    return x1, y1, x2, y2


def in_region(marker, face):
    x1, y1, x2, y2 = get_region(marker)
    fx1, fy1, fw, fh = face
    logging.debug(face)
    if (x1 < fx1) and ((fx1 + fw) < x2) and (y1 < fy1) and ((fy1 + fh) < y2):
        return True

    return False


marker_detector = ObjectDetector()
face_detector = FaceDetector()
frame_idx = 0
writer = videowriter.VideoWriter(cam, out_file="/home/user/opencv/videos/object-detection.mp4")
status = hud.HudStatus()
pc = PersonCounter()
curr_frame = None


def count_callback():
    return pc.count(curr_frame)


voice_detector = voice_commands.VoiceCommand(callback=count_callback)
voice_detector.start()

while True:
    ret, frame = cam.read()
    if ret != True:
        print(ret)
    frame = imutils.resize(frame, width=1024)
    curr_frame = frame.copy()
    frame_idx += 1
    marker = marker_detector.detect(frame)

    if frame_idx == 1:
        status.set_status("starting")

    if pc.is_running():
        status.set_status("counting persons", 10)

    status.update()

    if marker is not None:
        marker = cv2.boundingRect(marker)
        faces = face_detector.detect(frame)
        for face in faces:
            if in_region(marker, face):
                hud.mark_rois(frame, [face], label="face")
                x1, y1, w, h = face

                p_x1 = x1 - w
                p_x2 = (3 * w)
                p_y1 = y1
                p_y2 = (6 * h)

                hud.mark_rois(frame, [(p_x1, p_y1, p_x2, p_y2)])

    pc_frame, pc_count = pc.get_count()
    if pc_frame is not None:
        status.set_status("found persons: {0}".format(pc_count), 100)
        cv2.imshow("person count", pc_frame)
        cv2.moveWindow("person count", 1024, 0)

    hud.get_hud(frame, status.get_status(), frame_idx)
    cv2.imshow("frame", frame)
    cv2.moveWindow("frame", 0, 0)
    writer.write(frame)

    key = cv2.waitKey(1) & 0xff
    if key == 27:
        break

    if key == ord('c'):
        pc.count(frame)

del voice_detector
cv2.destroyAllWindows()
cam.release()
