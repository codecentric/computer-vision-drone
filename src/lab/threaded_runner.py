""" cvdrone.de runner - starts the drone and navigation

* Author: Oli Moser (http://twitter.com/moseroli)
* Version: 0.1 (08.2017)

"""

import cv2
from controller import DroneController
from display import DroneView
from utils.detectors import ObjectDetector
from config.drone_config import *
from utils.threads import *


video = cv2.VideoCapture(CONF.VIDEO_URL)
dc = DroneController()
dv = DroneView()
od = ObjectDetector()
tr = ThreadedReader()
dc.autopilot('true')

frame_idx = 0

while video.isOpened():

    while len(tr.pending) > 0 and tr.pending[0].ready():
        res, t0 = tr.pending.popleft().get()
        tr.latency.update(clock() - t0)
        cv2.imshow('threaded video', res)
        frame_idx += 1

    if len(tr.pending) < tr.thread_num:
        ret, frame = video.read()
        t = clock()
        tr.frame_interval.update(t - tr.last_frame_time)
        last_frame_time = t
        task = tr.pool.apply_async(dv.process_frame, (frame.copy(), t))
        tr.pending.append(task)

    key = cv2.waitKey(1) & 0xff
    if key == 27:
        break
