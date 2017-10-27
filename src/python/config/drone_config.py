import logging

logging.basicConfig(level=logging.DEBUG)


class CONF:
    VERSION = '0.2'
    # select 0 for local webcam or sdb file for connection to drone
    VIDEO_URL = 1
    # VIDEO_URL = '/Users/omoser/data/testvideos/test_small.mp4'
    # VIDEO_URL = './config/bebop.sdp'
    # URL of websocket that sends commands via node-bebop js library to drone
    WS_URL = 'ws://localhost:8000/'
    VIDEO_WIDTH = 1200
    #CNN_MODEL_NAME = "ssd_mobilenet_v1_coco_11_06_2017"
    CNN_MODEL_NAME = "ssd_inception_v2_coco_11_06_2017"
    #CNN_MODEL_NAME = "faster_rcnn_resnet101_coco_11_06_2017"
    #CNN_MODEL_NAME = "faster_rcnn_inception_resnet_v2_atrous_coco_11_06_2017"
    MARKER_PADDING_X = 0.05
    MARKER_PADDING_Y = 0.10
    MIDDLE_PADDING = 0.10
