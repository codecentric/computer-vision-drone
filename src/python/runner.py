""" cvdrone.de runner - starts the drone and navigation

* Author: Oli Moser (http://twitter.com/moseroli)
* Version: 0.1 (08.2017)

"""

import cv2
from controller import DroneController
from display import DroneView
from utils.detectors import ObjectDetector, MarkerDetector
from config.drone_config import *

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

while video.isOpened():
    ret, frame = video.read()
    frame_idx += 1

    marker_roi = md.detect_marker(frame)

    if marker_roi is not None:
        x, y, w, h = cv2.boundingRect(marker_roi)

        x1 = max(x - pad_x, 0)
        y1 = max(y - pad_y, 0)
        x2 = min(x + w + pad_x, video_width)
        y2 = min(y + h + pad_y, video_height)

        center_x = int(((x2 - x1) / 2) + x1)
        center_y = int(((y2 - y1) / 2) + y1)

        # marker is left of middle
        if center_x < (video_center_x - middle_padding):
            dc.rotate_left()
            action_str = "rotate left"

        # marker is right of middle
        elif center_x > (video_center_x + middle_padding):
            dc.rotate_right()
            action_str = "rotate right"

        else:
            action_str = "centered"

        marker_roi = frame[y1:y2, x1:x2]

    else:
        action_str = "no marker found"
        # dc.rotate_stop()

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
