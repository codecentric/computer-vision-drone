import cv2


cam = cv2.VideoCapture("http://192.168.42.12:8080/olitest")

while True:
    ret, frame = cam.read()
    cv2.imshow("frame", frame)
    cv2.waitKey(1)

