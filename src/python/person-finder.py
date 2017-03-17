# cvdrone.de
#
# correlation tracking demo using dlib
#
# oliver.moser@codecentric.de

from pydrone import *
import dlib
import cv2
import imutils
import detectors
import hud
import videowriter

tracker = dlib.correlation_tracker()
video = cv2.VideoCapture("./bebop.sdp")
# video = cv2.VideoCapture("/home/user/opencv/videos/object-tracking.mp4")

# video = cv2.VideoCapture(0)

cv2.namedWindow("video")

person_found = False
frame_idx = 0
pad = 5

start_pos = 1

# frame_idx = start_pos

# video.set(cv2.CAP_PROP_POS_FRAMES, start_pos)

writer = videowriter.VideoWriter(video, out_file="/home/user/opencv/videos/outvideo.mp4")


def prepare_frame(frame):
    frame = imutils.resize(frame, width=1280)
    return frame


def get_position(tracker):
    p = tracker.get_position()

    x1 = int(p.left())
    y1 = int(p.top())
    x2 = int(p.right())
    y2 = int(p.bottom())

    return x1, y1, x2, y2


while video.isOpened():
    ret, frame = video.read()
    frame = prepare_frame(frame)
    frame_idx += 1

    height, width = frame.shape[:2]
    center_margin = 100

    # img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    if not ret:
        break

    if frame_idx > start_pos:
        if not person_found:
            # check all 5 frames for new faces
            if frame_idx % 10 == 0:
                rois = detectors.detect_person(frame)
                print("Number of persons detected: {}".format(len(rois)))
                for rect in enumerate(rois):
                    x, y, w, h = rect[1]
                    x = int(x) - pad
                    y = int(y) - pad
                    w = int(w) + pad
                    h = int(h) + pad
                    print(x, y, w, h)

                    area = w * h
                    print("area: ", (w * h))
                    if 1200 < area < 2400:
                        tracker.start_track(frame, dlib.rectangle(x, y, x + w, y + h))
                        person_found = True
        else:
            tracker.update(frame)
            # check all 15 frames that tracker still tracks a face
            if frame_idx % 50 == 0:
                x1, y1, x2, y2 = get_position(tracker)
                rois = detectors.detect_person(frame[y1:y2, x1:x2])

                # if no face in tracker window -> reset tracker
                if len(rois) == 0:
                    person_found = False

            x1, y1, x2, y2 = get_position(tracker)

            frame = hud.mark_cross(frame, x1, y1, x2, y2)
            mask = np.zeros(frame.shape[:2], dtype=np.uint8)
            padding = 30
            w = 80

            top_left = (x1 - padding, y1 - padding)
            down_right = (x1 + padding + w, y1 + padding + (4 * w))

            mask = cv2.rectangle(mask, top_left, down_right, 255,
                                 thickness=-1)
            ori = frame.copy()
            frame = cv2.bitwise_and(frame, frame, mask=mask)
            blurred = cv2.GaussianBlur(frame, (3, 3), 0)
            edges = cv2.Canny(blurred, 20, 210)
            edges = cv2.cvtColor(edges, cv2.COLOR_GRAY2BGR)
            edges[:, :, 0] = 0
            edges[:, :, 2] = 0
            frame = cv2.addWeighted(frame, 1, edges, 1, 1)
            frame = cv2.addWeighted(frame, 1, ori, 0.2, 1)

            mask = np.zeros_like(frame)
            mask = cv2.rectangle(mask, (int(width/2)-center_margin, 0), (int(width/2)+center_margin, height), (0, 255, 0), thickness=-1)
            frame = cv2.addWeighted(frame, 1, mask, 0.05, 1)

            text = " | focused | "

            if x1 < int((width/2)-center_margin):
                text = " << turn "

            if x1 > int((width/2)+center_margin):
                text = " turn >> "

            xt, yt = down_right
            yt += 40
            xt -= 160
            cv2.putText(frame, text, (xt, yt),
                        hud.FONT, 1, hud.HUD_RED)

    hud.get_hud(frame, None, frame_idx)

    writer.write(frame)
    cv2.imshow("image", frame)
    cv2.moveWindow("image", 0, 0)

    k = cv2.waitKey(1) & 0xff
    if k == 27:
        break
        # dlib.hit_enter_to_continue()
