import dlib
import cv2
import numpy as np
import imutils

predictor_path = "./shape_predictor_68_face_landmarks.dat"

def configure_glasses():
    glasses_image = cv2.imread("glasses/sunglasses_1_cropped.jpg")
    glasses_image[np.where((glasses_image >= [200, 200, 200]).all(axis=2))] = [0, 0, 0]
    return glasses_image


glasses = configure_glasses()
glasses_x_length = glasses.shape[1]
glasses_y_length = glasses.shape[0]

def get_x_y_arr_from_shape(shape_arr):
    x_arr = [int(item.x) for item in shape_arr]
    y_arr = [int(item.y) for item in shape_arr]
    return x_arr, y_arr

def compute_middle_point(shape_arr):
    x_arr, y_arr = get_x_y_arr_from_shape(shape_arr)
    x = np.average(x_arr)
    y = np.average(y_arr)
    return int(x), int(y)


def compute_rotation_degree(left_eye_shapes, right_eye_shapes):
    left_eye = compute_middle_point(left_eye_shapes)
    right_eye = compute_middle_point(right_eye_shapes)
    right_angle_point = (right_eye[0], right_eye[1]+left_eye[1]-right_eye[1])
    c = right_eye[0] - left_eye[0]
    a = right_angle_point[1] - right_eye[1]
    alpha = np.degrees(np.arcsin(a/c))
    return alpha

def resize_glasses(left_point, right_point):
    x_length = right_point[0] - left_point[0]
    glasses_xy_rel = glasses_y_length / glasses_x_length
    y_length = x_length * glasses_xy_rel
    resized_glasses = cv2.resize(glasses, None, fx=x_length / glasses.shape[1], fy=y_length / glasses.shape[0])
    return resized_glasses

def get_rotated_glass_image(alpha, left_point, resized_glasses_shape):
    empty_img = white_img.copy()
    empty_img[left_point[1]:left_point[1] + resized_glasses_shape[0],\
    left_point[0]:left_point[0] + resized_glasses_shape[1]] = resized_glasses_img
    M = cv2.getRotationMatrix2D(left_point, alpha, 1)
    dst = cv2.warpAffine(empty_img, M, (cols, rows), borderValue=(0, 0, 0))
    return dst


detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor(predictor_path)

cam = cv2.VideoCapture(0)

detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor(predictor_path)
cv2.namedWindow('window_frame')

ret, img = cam.read()
mask = np.zeros_like(img)

resized_img = imutils.resize(img, width=1024)
rows, cols = resized_img.shape[:2]

white_img = np.zeros((resized_img.shape), np.uint8)
white_img[:] = (255, 255, 255)

frame_idx = 0
while True:
    ret, img = cam.read()

    img = imutils.resize(img, width=1024)
    mask = np.zeros_like(img)
    frame_idx += 1

    dets = detector(img, 1)
    det_idx = 0

    sunglasses = []
    try:
        lines = []
        combined_glasses_img = white_img.copy()
        for k, d in enumerate(dets):
            det_idx += 1
            shape = predictor(img, d)

            left_eye_shapes = shape.parts()[36:42]
            right_eye_shapes = shape.parts()[42:48]
            alpha = compute_rotation_degree(left_eye_shapes, right_eye_shapes)

            left_shapes = [shape.part(17), shape.part(17), shape.part(18)]
            left_point = compute_middle_point(left_shapes)
            right_shapes = [shape.part(25), shape.part(26), shape.part(26)]
            right_point = compute_middle_point(right_shapes)

            resized_glasses_img = resize_glasses(left_point, right_point)
            rotated_glasses_img = get_rotated_glass_image(alpha, left_point, resized_glasses_img.shape)

            lines.append([right_point, (shape.part(16).x, shape.part(16).y)])
            lines.append([left_point, (shape.part(0).x, shape.part(0).y)])
            sunglasses.append(rotated_glasses_img)

        for sunglass in sunglasses:
            combined_glasses_img += sunglass

        cv2.imshow("combined_glasses", combined_glasses_img)
        for line  in lines:
            cv2.line(img, line[0], line[1], (14, 1, 0, 0.1), thickness=3)
        img = cv2.addWeighted(img, 1, combined_glasses_img, 0.7, 0.5)

        gray_glass = cv2.cvtColor(combined_glasses_img.copy(), cv2.COLOR_BGR2GRAY)
        _, gray_glass2 = cv2.threshold(gray_glass, 200, 255, cv2.THRESH_BINARY)
        mask = cv2.bitwise_not(gray_glass2)

        combined_glasses_img[np.where((combined_glasses_img >= [200, 200, 200]).all(axis=2))] = [0, 0, 0]

        combined_img = cv2.bitwise_or(img, combined_glasses_img, mask=~mask)

        combined_img += combined_glasses_img
        img = combined_img

    except Exception as e:
        print(e)
        continue

    cv2.imshow("sunglass_faces", img)
    key = cv2.waitKey(1) & 0xff
    if key == 27:
        break
