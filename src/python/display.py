""" cvdrone.de Display driver - show video from drone with HUD

* Author: Oli Moser (http://twitter.com/moseroli)
* Version: 0.1 (08.2017)

"""

import cv2
import imutils
from config.drone_config import *
from utils.hud import get_hud


class DroneView():
    def __init__(self):
        self.frame = None

    def process_frame(self, frame, t0, idx=None):
        get_hud(frame, idx=idx)
        return frame, t0

