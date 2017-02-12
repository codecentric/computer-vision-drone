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


tracker = dlib.correlation_tracker()
video = cv2.VideoCapture("/home/user/opencv/videos/correlation-tracking.mp4")
#video = cv2.VideoCapture(0)

cv2.namedWindow("video")

person_found = False
frame_idx = 0
pad = 5


def prepare_frame(frame):
    frame = imutils.resize(frame, width=1024)
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

    # img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    if not ret:
        break

    if not person_found:
        # check all 5 frames for new faces
        if frame_idx % 5 == 0:
            rois = detectors.detect_person(frame)
            print("Number of persons detected: {}".format(len(rois)))
            for rect in enumerate(rois):
                x, y, w, h = rect[1]
                x = int(x) - pad
                y = int(y) - pad
                w = int(w) + pad
                h = int(h) + pad
                print(x, y, w, h)
                tracker.start_track(frame, dlib.rectangle(x, y, x+w, y+h))
                person_found = True
    else:
        tracker.update(frame)
        # check all 15 frames that tracker still tracks a face
        if frame_idx % 150 == 0:
            x1, y1, x2, y2 = get_position(tracker)
            rois = detectors.detect_person(frame[y1:y2, x1:x2])

            # if no face in tracker window -> reset tracker
            if len(rois) == 0:
                person_found = False

        x1, y1, x2, y2 = get_position(tracker)

        mask = np.zeros_like(frame)
        cv2.line(mask, (x1, int((y2-y1)/2+y1)), (x2, int((y2-y1)/2+y1)), (0, 0, 255), thickness=1)
        cv2.line(mask, (int((x2-x1)/2+x1), y1), (int((x2-x1)/2+x1), y2), (0, 0, 255), thickness=1)
        frame = cv2.addWeighted(frame, 1, mask, 0.8, 1)
        #cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), thickness=1)

    hud.get_hud(frame, None, frame_idx)

    cv2.imshow("image", frame)

    k = cv2.waitKey(1) & 0xff
    if k == 27:
        break
        # dlib.hit_enter_to_continue()
