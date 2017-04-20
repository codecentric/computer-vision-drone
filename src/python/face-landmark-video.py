import dlib
import cv2
import numpy as np

predictor_path = "./shape_predictor_68_face_landmarks.dat"

detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor(predictor_path)

cam = cv2.VideoCapture(0)

detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor(predictor_path)
win = dlib.image_window()

ret, img = cam.read()
mask = np.zeros_like(img)

frame_idx = 0

while True:
    ret, img = cam.read()
    mask = np.zeros_like(img)
    frame_idx += 1

    dets = detector(img, 1)
    det_idx = 0

    for k, d in enumerate(dets):
        det_idx += 1
        shape = predictor(img, d)

        radius = int( (shape.part(41).x - shape.part(17).x) * 1.2)
        cv2.circle(img, (shape.part(41).x, shape.part(41).y), radius, (0, 0, 0), thickness=-1)
        cv2.circle(img, (shape.part(47).x, shape.part(47).y), radius, (0, 0, 0), thickness=-1)
        cv2.line(img, (shape.part(39).x, shape.part(39).y),
                 (shape.part(42).x, shape.part(42).y), (0, 0, 0), thickness=3)
        cv2.line(img, (shape.part(36).x, shape.part(36).y),
                 (shape.part(0).x, shape.part(0).y), (0, 0, 0), thickness=3)
        cv2.line(img, (shape.part(45).x, shape.part(45).y),
                 (shape.part(16).x, shape.part(16).y), (0, 0, 0), thickness=3)




    cv2.imshow("face", img)
    key = cv2.waitKey(1) & 0xff
    if key == 27:
        break
