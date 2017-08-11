""" cvdrone.de Drone Controller - sends navigation commands to websocket server

requires node-bebop JS library and running WebSocket Server from src/main/drone/cvmain.js

* Author: Oli Moser (http://twitter.com/moseroli)
* Version: 0.1 (08.2017)

"""

import json
from time import sleep
from utils.Websocket import WebsocketClient

LEFT, STOP, RIGHT = [-1], [0], [1]


class DroneController():
    def __init__(self):
        self.ws = WebsocketClient()
        # do a short sleep until ws connection is ready
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
        self.ws.send(json.dumps({'function': 'takeOff', 'args': None}))

    def land(self):
        self.ws.send(json.dumps({'function': 'land', 'args': None}))

    def autopilot(self, bool):
        self.ws.send(json.dumps({'function': 'autoPilot', 'args': [bool]}))


