""" cvdrone.de runner - starts the drone and navigation

* Author: Oli Moser (http://twitter.com/moseroli)
* Version: 0.1 (08.2017)

"""

import cv2
import imutils
import numpy as np

from controller import DroneController
from display import DroneView
from utils.detectors import ObjectDetector, MarkerDetector
import utils.hud
from config.drone_config import *
import threading

video = cv2.VideoCapture(CONF.VIDEO_URL)
dc = DroneController()
dv = DroneView()
md = MarkerDetector()
od = ObjectDetector()
dc.autopilot('true')

# pop one frame to get dimensions
ret, frame = video.read()
video_height, video_width = frame.shape[:2]
# the exact middle of the image
video_center_x = int(video_width / 2)
# region in middle of image that counts as "focused"
middle_padding = int(video_width * CONF.MIDDLE_PADDING)

# padding around marker object for further detections
pad_x = int(video_width * CONF.MARKER_PADDING_X)
pad_y = int(video_height * CONF.MARKER_PADDING_Y)

frame_idx = 0
action_str = ""


def get_roi_size(roi):
    y1, x1, y2, x2 = tuple(roi.tolist())
    return int((x2 - x1) * (y2 - y1))


def is_upright(roi):
    y1, x1, y2, x2 = tuple(roi.tolist())
    w = abs(x2 - x1)
    h = abs(y2 - y1)
    if (w > h) and (w * h > 500):
        return False
    else:
        return True


while video.isOpened():
    ret, frame = video.read()
    frame_idx += 1

    if not od.running_detection:
        worker = threading.Thread(target=od.detect_persons, args=[frame])
        worker.start()

    persons = od.last_detection
    persons = list(filter(is_upright, persons))

    if len(persons) > 0:
        person = max(persons, key=get_roi_size)

        by1, bx1, by2, bx2 = tuple(person.tolist())
        bx1 = int(bx1 * video_width)
        bx2 = int(bx2 * video_width)
        by1 = int(by1 * video_height)
        by2 = int(by2 * video_height)
        utils.hud.mark_rois(frame, [[bx1, by1, bx2-bx1, by2-by1]])

        x1 = max(bx1 - pad_x, 0)
        y1 = max(by1 - pad_y, 0)
        x2 = min(bx2 + pad_x, video_width)
        y2 = min(by2 + pad_y, video_height)

        center_x = int(((x2 - x1) / 2) + x1)
        center_y = int(((y2 - y1) / 2) + y1)

        # person is left of middle
        if center_x < (video_center_x - middle_padding):
            dc.rotate_left()
            action_str = "rotate left"

        # person is right of middle
        elif center_x > (video_center_x + middle_padding):
            dc.rotate_right()
            action_str = "rotate right"

        else:
            action_str = "centered"

    dv.process_frame(frame, 0, idx=frame_idx, action_str=action_str)
    cv2.imshow("drone view", frame)

    key = cv2.waitKey(1) & 0xff

    if key == ord('t'):
        dc.take_off()
    if key == ord('l'):
        dc.land()
    if key == ord('s'):
        dc.rotate_stop()
    if key == 2:
        dc.rotate_left()
    if key == 3:
        dc.rotate_right()

    if key == 27:
        dc.land()
        break
