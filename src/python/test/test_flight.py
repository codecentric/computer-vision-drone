import cv2
from time import sleep
from controller import DroneController
from config.drone_config import *

dc = DroneController()


def test_flight(dc):
    duration = 2

    dc.take_off()
    sleep(duration)

    dc.rotate_left()
    sleep(duration)

    dc.rotate_right()
    sleep(duration)

    dc.rotate_stop()
    sleep(duration)

    dc.land()
    dc.autopilot('true')


test_flight(dc)
