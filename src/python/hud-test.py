from pydrone import *
import hud
import detectors

file = "../../media/drone-video-test.mp4"
file = "http://192.168.42.12:8080/olitest"
video = cv2.VideoCapture(file)
frame_idx = 0

while video.isOpened():
    ret, frame = video.read()
    frame_idx += 1

    if frame_idx < 100:
        hud.get_hud(frame, action="STARTING DRONE", idx=frame_idx)
    else:
        hud.get_hud(frame, action=None, idx=frame_idx)

    if frame_idx % 10 == 0:
        detectors.detect_person(frame)

    cv2.imshow("video", frame)

    key = cv2.waitKey(1) & 0xff
    if key == 27:
        break

