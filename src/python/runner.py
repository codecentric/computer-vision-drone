""" cvdrone.de runner - starts the drone and navigation

* Author: Oli Moser (http://twitter.com/moseroli)
* Version: 0.1 (08.2017)

"""

import cv2
from controller import DroneController
from display import DroneView
from utils.detectors import ObjectDetector
from config.drone_config import *

video = cv2.VideoCapture(CONF.VIDEO_URL)
dc = DroneController()
dv = DroneView()
od = ObjectDetector()
dc.autopilot('true')

frame_idx = 0

while video.isOpened():
    ret, frame = video.read()
    frame_idx += 1

    dv.process_frame(frame, idx=frame_idx)
    result = od.detect_objects(frame)

    cv2.imshow("cvdrone View", frame)
    cv2.moveWindow("cvdrone View", 0, 0)

    key = cv2.waitKey(1) & 0xff
    if key == 27:
        break

