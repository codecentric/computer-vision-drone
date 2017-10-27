""" cvdrone.de runner - starts the drone and navigation

* Author: Oli Moser (http://twitter.com/moseroli)
* Version: 0.1 (08.2017)

"""

import cv2
import imutils
import numpy as np

from controller import DroneController
from display import DroneView
from utils.detectors2 import ObjectDetector, MarkerDetector
import utils.hud
from config.drone_config import *
import threading

video = cv2.VideoCapture(CONF.VIDEO_URL)
# dc = DroneController()
dv = DroneView()
md = MarkerDetector()
od = ObjectDetector()
# dc.autopilot('true')

# pop one frame to get dimensions
WIDTH = 1200
ret, frame = video.read()
frame = imutils.resize(frame, width=WIDTH)
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


rx1 = int(video_width / 4)
rx2 = rx1 * 3
ry1 = int(video_height / 8)
ry2 = ry1 * 7

while video.isOpened():
    ret, frame = video.read()
    frame = imutils.resize(frame, width=WIDTH)
    frame_idx += 1

    if not od.running_detection:
        worker = threading.Thread(target=od.detect_persons, args=[frame])
        worker.start()

    boxes = od.last_boxes
    classes = od.last_classes

    dv.process_frame(frame, 0, idx=frame_idx, action_str=action_str)
    cv2.imshow("drone view", frame)

    key = cv2.waitKey(1) & 0xff

