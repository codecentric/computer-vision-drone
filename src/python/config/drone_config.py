import logging

logging.basicConfig(level=logging.DEBUG)


class CONF:
    VERSION = '0.2'
    # select 0 for local webcam or sdb file for connection to drone
    VIDEO_URL = 0
    # VIDEO_URL = './config/bebop.sdp'
    # URL of websocket that sends commands via node-bebop js library to drone
    WS_URL = 'ws://localhost:8000/'
    VIDEO_WIDTH = 600
