from pydrone import *
import pydrone.hud

file = "../../../media/drone-video-test.mp4"
video = cv2.VideoCapture(file)
frame_idx = 0

while video.isOpened():
    ret, frame = video.read()
    frame_idx += 1

    if frame_idx < 80:
        pydrone.hud.get_hud(frame, action="STARTING DRONE", idx=frame_idx)
    elif 80 < frame_idx < 500:
        pydrone.hud.get_hud(frame, action=None, idx=frame_idx)


    cv2.imshow("video", frame)
    cv2.waitKey(1) & 0xff

