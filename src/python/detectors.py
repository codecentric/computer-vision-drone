from pydrone import *
import hud

body_cascade = cv2.CascadeClassifier('./detectors/haarcascade_upperbody.xml')


def detect_person(frame):
    global body_cascade
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    rois = body_cascade.detectMultiScale(gray, 1.3, 5)

    hud.mark_rois(frame, rois)






