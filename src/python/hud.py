from pydrone import *
from datetime import datetime

HUD_COLOR = (0, 100, 0)
HUD_CLIGHT = (200, 255, 200)
HUD_RED = (0, 0, 255)
FONT_SIZE = 0.5
FONT = cv2.FONT_HERSHEY_SIMPLEX


def mark_cross(frame, x1, y1, x2, y2):
    mask = np.zeros_like(frame)
    cv2.line(mask, (x1, int((y2 - y1) / 2 + y1-1)), (x2, int((y2 - y1) / 2 + y1-1)), HUD_RED, thickness=1)
    cv2.line(mask, (int((x2 - x1) / 2 + x1-1), y1), (int((x2 - x1) / 2 + x1-1), y2), HUD_RED, thickness=1)

    cv2.line(mask, (x1, int((y2 - y1) / 2 + y1)), (x2, int((y2 - y1) / 2 + y1)), HUD_CLIGHT, thickness=1)
    cv2.line(mask, (int((x2 - x1) / 2 + x1), y1), (int((x2 - x1) / 2 + x1), y2), HUD_CLIGHT, thickness=1)

    cv2.line(mask, (x1, int((y2 - y1) / 2 + y1+1)), (x2, int((y2 - y1) / 2 + y1+1)), HUD_RED, thickness=1)
    cv2.line(mask, (int((x2 - x1) / 2 + x1+1), y1), (int((x2 - x1) / 2 + x1+1), y2), HUD_RED, thickness=1)
    frame = cv2.addWeighted(frame, 1, mask, 0.8, 1)
    return frame


def mark_rois(frame, rois):
    mask = np.zeros_like(frame, dtype=np.uint8)

    for (x, y, w, h) in rois:
        cv2.rectangle(mask, (x, y), (x + w, y + h), HUD_CLIGHT, thickness=1)
        cv2.rectangle(mask, (x - 1, y - 1), (x + w + 1, y + h + 1), HUD_COLOR, thickness=1)
        cv2.rectangle(mask, (x + 1, y + 1), (x + w - 1, y + h - 1), HUD_COLOR, thickness=1)
        cv2.putText(mask, "person detected", (x, y - 10),
                    FONT, FONT_SIZE, HUD_COLOR)

    cv2.addWeighted(frame, 1, mask, 0.5, 1, dst=frame)


def apply_hud(frame, mask):
    cv2.addWeighted(frame, 1, mask, 0.5, 1, dst=frame)
    mask = cv2.circle(mask, (512, 330), 400, (0, 40, 0), -1)
    cv2.addWeighted(frame, 1, mask, 0.5, 1, dst=frame)


def get_hud(frame, action=None, idx=None):
    mask = np.zeros_like(frame, dtype=np.uint8)
    rows, cols = frame.shape[:2]

    margin = 40
    x1, y1 = margin, margin
    x2, y2 = cols - margin, rows - margin
    xc, yc = int(x2 / 2), int(y2 / 2)

    mask = cv2.rectangle(mask, (x1 - 1, y1 - 1), (x2 + 1, y2 + 1), HUD_COLOR, thickness=1)
    mask = cv2.rectangle(mask, (x1, y1), (x2, y2), HUD_CLIGHT, thickness=1)
    mask = cv2.rectangle(mask, (x1 + 1, y1 + 1), (x2 - 1, y2 - 1), HUD_COLOR, thickness=1)

    t = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S.%f')[:-3]
    cv2.putText(mask, "cvdrone.de - pydrone version {0}".format(VERSION), (x1 + 20, y1 - 10),
                FONT, FONT_SIZE, HUD_COLOR)
    cv2.putText(mask, "{0} - {1}".format(t, idx), (x1 + 20, y2 + 20),
                FONT, FONT_SIZE, HUD_COLOR)

    if action:
        cv2.putText(mask, "... {0} ...".format(action), (xc - (len(action) * 7), yc + 50),
                    FONT, FONT_SIZE, HUD_COLOR)

    m = {-1: HUD_COLOR, 0: HUD_CLIGHT, 1: HUD_COLOR}
    for i in [-1, 0, 1]:
        cv2.line(mask, (xc - 100, yc - i), (xc - 20, yc - i), m[i], thickness=1)
        cv2.line(mask, (xc + 20, yc - i), (xc + 100, yc - i), m[i], thickness=1)
        cv2.line(mask, (xc - 100 - i, yc - 10), (xc - 100 - i, yc + 10), m[i], thickness=1)
        cv2.line(mask, (xc + 100 + i, yc - 10), (xc + 100 + i, yc + 10), m[i], thickness=1)

    for i in [-1, 1]:
        cv2.line(mask, (xc - 50, yc - i - (i * 50)), (xc - 30, yc - i - (i * 50)), HUD_CLIGHT, thickness=1)
        cv2.line(mask, (xc - 10, yc - i - (i * 50)), (xc + 10, yc - i - (i * 50)), HUD_CLIGHT, thickness=1)
        cv2.line(mask, (xc + 30, yc - i - (i * 50)), (xc + 50, yc - i - (i * 50)), HUD_CLIGHT, thickness=1)

        cv2.line(mask, (xc - 50, yc - i - (i * 50) + 1), (xc - 30, yc - i - (i * 50) + 1), HUD_COLOR, thickness=1)
        cv2.line(mask, (xc - 10, yc - i - (i * 50) + 1), (xc + 10, yc - i - (i * 50) + 1), HUD_COLOR, thickness=1)
        cv2.line(mask, (xc + 30, yc - i - (i * 50) + 1), (xc + 50, yc - i - (i * 50) + 1), HUD_COLOR, thickness=1)

        cv2.line(mask, (xc - 50, yc - i - (i * 50) - 1), (xc - 30, yc - i - (i * 50) - 1), HUD_COLOR, thickness=1)
        cv2.line(mask, (xc - 10, yc - i - (i * 50) - 1), (xc + 10, yc - i - (i * 50) - 1), HUD_COLOR, thickness=1)
        cv2.line(mask, (xc + 30, yc - i - (i * 50) - 1), (xc + 50, yc - i - (i * 50) - 1), HUD_COLOR, thickness=1)

    apply_hud(frame, mask)
