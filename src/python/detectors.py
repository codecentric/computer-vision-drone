from pydrone import *
import hud

body_cascade = cv2.CascadeClassifier('/usr/share/opencv/haarcascades/haarcascade_frontalface_default.xml')
hog = cv2.HOGDescriptor()
hog.setSVMDetector(cv2.HOGDescriptor_getDefaultPeopleDetector())


def detect_person(frame):
    global body_cascade
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    rois = body_cascade.detectMultiScale(gray, 1.25, 3)

    hud.mark_rois(frame, rois)
    return rois


def detect_person_hog(frame):
    # detect people in the image
    (rects, weights) = hog.detectMultiScale(frame, winStride=(4, 4),
                                            padding=(8, 8), scale=1.25)

    return rects


