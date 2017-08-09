from config import *
import cv2
import subprocess
import os
import re
import threading
import hud

DARKNET_PATH = "/home/user/opencv/darknet"
DARKNET_CMD = "{path}/darknet detect {path}/cfg/yolo.cfg {path}/cfg/yolo.weights {image} -thresh 0.4"
TMP_FILE = "/tmp/count_person.jpg"


class PersonCounter:
    def __init__(self):
        self.frame = None
        self.running = False
        self.thread = None
        self.finished = False
        self.image = None
        self.person_count = 0
        self.displayed = False

    def is_running(self):
        if self.thread is not None:
            if self.thread.isAlive():
                self.running = True
            else:
                self.running = False
        else:
            self.running = False
        return self.running

    def run_darknet(self):
        os.chdir(DARKNET_PATH)
        cmd = DARKNET_CMD.format(path=DARKNET_PATH, image=TMP_FILE).split(" ")
        output = subprocess.check_output(cmd)
        logging.debug(output)
        persons = len(re.findall("person:", str(output)))
        logging.debug("found persons {0}".format(persons))

        self.person_count = persons
        self.image = cv2.imread(DARKNET_PATH + "/my_output.jpg")
        hud.get_hud(self.image, "found persons: {0}".format(self.person_count))
        self.finished = True

    def get_count(self):
        if self.finished and not self.displayed:
            self.displayed = True
            return self.image, self.person_count
        else:
            return None, 0

    def count(self, frame):
        if self.running:
            return

        # reset on second run
        if self.finished:
            self.person_count = 0
            self.image = None
            self.finished = False
            self.thread = None
            self.displayed = False

        self.frame = frame

        self.running = True
        cv2.imwrite(TMP_FILE, self.frame)

        self.thread = threading.Thread(target=self.run_darknet)
        self.thread.start()

