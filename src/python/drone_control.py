from time import sleep
from Websocket import WebsocketClient
import json

LEFT, STOP, RIGHT = [1], [0], [-1]


class DroneControl():
    def __init__(self):
        self.ws = WebsocketClient()
        sleep(1)

    def _rotate(self, direction):
        self.ws.send(json.dumps({'function': 'turn', 'args': direction}))

    def rotate_left(self):
        self._rotate(LEFT)

    def rotate_stop(self):
        self._rotate(STOP)

    def rotate_right(self):
        self._rotate(RIGHT)

    def take_off(self):
        pass

    def land(self):
        pass

    def autopilot(self, bool):
        self.ws.send(json.dumps({'function': 'autoPilot', 'args': [bool]}))


def test_flight():
    duration = 2
    drone = DroneControl()

    drone.take_off()
    sleep(duration)

    drone.rotate_left()
    sleep(duration)

    drone.rotate_right()
    sleep(duration)

    drone.rotate_stop()
    sleep(duration)

    drone.land()
    drone.autopilot('true')


test_flight()
