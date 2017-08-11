# -*- coding: utf-8 -*-
"""object detection with google tensorflow API

Version 0.1 - 08/2017 - http://twitter.com/moseroli
"""

from config.drone_config import *

import cv2
import numpy as np
import tensorflow as tf
import utils.hud as hud


class ObjectDetector:
    def __init__(self, model_name=CONF.CNN_MODEL_NAME):
        self.model_name = model_name
        self.check_point = "./models/{}/frozen_inference_graph.pb".format(self.model_name)
        self.num_classes = 90

        self.detection_graph = tf.Graph()
        self.thresh = 0.5

        with self.detection_graph.as_default():
            od_graph_def = tf.GraphDef()
            with tf.gfile.GFile(self.check_point, 'rb') as fid:
                serialized_graph = fid.read()
                od_graph_def.ParseFromString(serialized_graph)
                tf.import_graph_def(od_graph_def, name='')

            # initialize tensorflow session without GPU
            self.sess = tf.Session(graph=self.detection_graph)

    def detect_objects(self, frame):
        """
           :returns
                boxes: a numpy array of shape [N, 4]
                classes: a numpy array of shape [N]
                scores: a numpy array of shape [N] or None.
                num_detections: ?
        """
        # Expand dimensions since the model expects images to have shape: [1, None, None, 3]
        image_np_expanded = np.expand_dims(frame, axis=0)
        image_tensor = self.detection_graph.get_tensor_by_name('image_tensor:0')

        # Each box represents a part of the image where a particular object was detected.
        boxes = self.detection_graph.get_tensor_by_name('detection_boxes:0')

        # Each score represent how level of confidence for each of the objects.
        scores = self.detection_graph.get_tensor_by_name('detection_scores:0')
        classes = self.detection_graph.get_tensor_by_name('detection_classes:0')
        num_detections = self.detection_graph.get_tensor_by_name('num_detections:0')

        try:
            (boxes, scores, classes, num_detections) = self.sess.run(
                [boxes, scores, classes, num_detections],
                feed_dict={image_tensor: image_np_expanded})
        except Exception as ex:
            logging.debug("skipping error in tensorflow detection {0}".format(ex))
            return [], [], [], []

        return boxes, scores, classes, num_detections

    def detect_persons(self, roi):
        pass


class MarkerDetector:
    marker_color_lower = (3, 80, 130)
    marker_color_upper = (10, 190, 255)
    marker_min_area = 400

    def detect_marker(self, frame):

        hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HLS)
        mask = cv2.inRange(hsv, self.marker_color_lower,
                           self.marker_color_upper)
        mask = cv2.erode(mask, None, iterations=2)
        mask = cv2.dilate(mask, None, iterations=2)

        #print(hsv[200,300])

        _, contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL,
                                          cv2.CHAIN_APPROX_SIMPLE)

        try:
            contour = sorted(contours, key=cv2.contourArea, reverse=True)[0]
            if cv2.contourArea(contour) < self.marker_min_area:
                contour = None
            else:
                hud.mark_rois(frame, [cv2.boundingRect(contour)], label="marker detected")
        except IndexError:
            contour = None

        return contour
