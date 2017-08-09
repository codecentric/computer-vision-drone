import cv2

cam = cv2.VideoCapture("./bebop.sdp")

while True:
    ret, frame = cam.read()
    cv2.imshow("frame", frame)
    cv2.waitKey(1)

