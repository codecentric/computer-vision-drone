from pydrone import *
import pydrone.hud
import pydrone.detectors

file = "../../../media/drone-video-test.mp4"
video = cv2.VideoCapture(file)
frame_idx = 0

while video.isOpened():
    ret, frame = video.read()
    frame_idx += 1

    if frame_idx < 100:
        pydrone.hud.get_hud(frame, action="STARTING DRONE", idx=frame_idx)
        cv2.imshow("video", frame)

    elif 100 < frame_idx < 1000:
        if frame_idx % 2 == 0:
            pydrone.hud.get_hud(frame, action=None, idx=frame_idx)
            pydrone.detectors.detect_person(frame)
            cv2.imshow("video", frame)


    #cv2.imshow("video", frame)
    cv2.moveWindow("video", 10, 10)

    cv2.waitKey(1) & 0xff

