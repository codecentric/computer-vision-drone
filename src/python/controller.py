""" cvdrone.de Drone Controller - sends navigation commands to websocket server

requires node-bebop JS library and running WebSocket Server from src/main/drone/cvmain.js

* Author: Oli Moser (http://twitter.com/moseroli)
* Version: 0.1 (08.2017)

"""

import json
from time import sleep, time
from utils.Websocket import WebsocketClient

LEFT, STOP, RIGHT = [-1], [0], [1]
MAX_CMD_INTERVAL = 0.1  # in seconds


class DroneController:
    def __init__(self):
        self.ws = WebsocketClient()
        # do a short sleep until ws connection is ready
        sleep(1)
        self.last_command = time()
        self.flying = False

    def _rotate(self, direction):
        now = time()
        if self.flying:
            if now - self.last_command > MAX_CMD_INTERVAL:
                self.ws.send(json.dumps({'function': 'turn', 'args': direction}))
                self.last_command = time()

    def rotate_left(self):
        self._rotate(LEFT)

    def rotate_stop(self):
        self._rotate(STOP)

    def rotate_right(self):
        self._rotate(RIGHT)

    def take_off(self):
        self.last_command = time() + 5  # do nothing for 5 seconds after takeoff
        self.flying = True
        self.ws.send(json.dumps({'function': 'takeOff', 'args': None}))

    def land(self):
        self.ws.send(json.dumps({'function': 'land', 'args': None}))

    def autopilot(self, bool):
        self.ws.send(json.dumps({'function': 'autoPilot', 'args': [bool]}))
