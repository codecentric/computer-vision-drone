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

    dv.process_frame(frame, 0, idx=frame_idx)

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
