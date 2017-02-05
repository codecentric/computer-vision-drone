from pydrone import *
from datetime import datetime

HUD_COLOR = (0, 255, 0)
FONT_SIZE = 0.5
FONT = cv2.FONT_HERSHEY_SIMPLEX


def mark_roi(frame, roi):
    pass


def apply_hud(frame, mask):
    cv2.addWeighted(frame, 1, mask, 0.5, 1, dst=frame)


def get_hud(frame, action=None, idx=None):
    mask = np.zeros_like(frame, dtype=np.uint8)
    rows, cols = frame.shape[:2]

    margin = 80
    x1, y1 = margin, margin
    x2, y2 = cols - margin, rows - margin
    xc, yc = int(x2 / 2), int(y2 / 2)

    mask = cv2.rectangle(mask, (x1, y1), (x2, y2), HUD_COLOR, thickness=1)

    t = datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S.%f')[:-3]
    cv2.putText(mask, "cvdrone.de - pydrone version {0}".format(VERSION), (x1 + 20, y1 - 10),
                FONT, FONT_SIZE, HUD_COLOR)
    cv2.putText(mask, "{0} - {1}".format(t, idx), (x1 + 20, y2 + 20),
                FONT, FONT_SIZE, HUD_COLOR)

    cv2.line(mask, (xc - 100, yc), (xc - 20, yc), HUD_COLOR, thickness=1)
    cv2.line(mask, (xc + 20, yc), (xc + 100, yc), HUD_COLOR, thickness=1)
    cv2.line(mask, (xc - 100, yc - 10), (xc - 100, yc + 10), HUD_COLOR, thickness=1)
    cv2.line(mask, (xc + 100, yc - 10), (xc + 100, yc + 10), HUD_COLOR, thickness=1)

    apply_hud(frame, mask)
