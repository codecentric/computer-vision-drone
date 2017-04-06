# dlib facial landmark detection

dlib is an excellent library for computer vision. with the following code 
you can detect landmarks in a face:

![dlib facial landmarks](./media/dlib-facial-landmark-detection.png)

```python
import os
import dlib
import glob
import cv2

predictor_path = "./shape_predictor_68_face_landmarks.dat"
faces_folder_path = "/home/user/opencv/computer-vision-drone/src/python/employees/"

detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor(predictor_path)

for f in glob.glob(os.path.join(faces_folder_path, "*oser*")):
    img = cv2.imread(f)

    dets = detector(img, 1)

    for k, d in enumerate(dets):
        print("Detection {}: Left: {} Top: {} Right: {} Bottom: {}".format(
            k, d.left(), d.top(), d.right(), d.bottom()))
        # Get the landmarks/parts for the face in box d.
        shape = predictor(img, d)
        print("Part 0: {}, Part 1: {} ...".format(shape.part(0),
                                                  shape.part(1)))

        for i in range(1, 68):
            x = shape.part(i).x
            y = shape.part(i).y

            img = cv2.putText(img, str(i), (x, y), cv2.FONT_HERSHEY_SIMPLEX, 0.3, (0, 255, 0), 1)

        nose_x = shape.part(30).x
        nose_y = shape.part(30).y

        radius = int(abs(shape.part(35).x - shape.part(31).x) / 2)
        img = cv2.circle(img, (nose_x, nose_y), radius, (0, 0, 255), 1)

    cv2.imshow("image", img)
    key = cv2.waitKey(0) & 0xff

    if key == 27:
        break
```