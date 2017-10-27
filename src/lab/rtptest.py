import cv2

cam = cv2.VideoCapture("rtsp://10.10.58.136:554/play1.sdp")

while True:
    ret, frame = cam.read()
    cv2.imshow("frame", frame)
    cv2.waitKey(1)

