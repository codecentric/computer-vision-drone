import cv2
from multiprocessing.pool import ThreadPool
from collections import deque


class StatValue:
    def __init__(self, smooth_coef=0.5):
        self.value = None
        self.smooth_coef = smooth_coef

    def update(self, v):
        if self.value is None:
            self.value = v
        else:
            c = self.smooth_coef
            self.value = c * self.value + (1.0 - c) * v


def clock():
    return cv2.getTickCount() / cv2.getTickFrequency()


class ThreadedReader:
    thread_num = cv2.getNumberOfCPUs()
    pool = ThreadPool(processes=thread_num)
    pending = deque()

    latency = StatValue()
    frame_interval = StatValue()
    last_frame_time = clock()
