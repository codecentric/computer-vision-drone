import numpy as np
import cv2

import hud



def draw_flow(img, flow, step=16):
    h, w = img.shape[:2]
    y, x = np.mgrid[step / 2:h:step, step / 2:w:step].reshape(2, -1).astype(int)
    fx, fy = flow[y, x].T
    lines = np.vstack([x, y, x + fx, y + fy]).T.reshape(-1, 2, 2)
    lines = np.int32(lines + 0.5)
    vis = img
    cv2.polylines(vis, lines, 0, (200, 100, 0))
    for (x1, y1), (x2, y2) in lines:
        cv2.circle(vis, (x1, y1), 1, (200, 100, 0), -1)
    return vis



cam = cv2.VideoCapture("../../../videos/motion-flow.mp4")
ret, prev = cam.read()
prev = hud.prepare_frame(prev)
prevgray = cv2.cvtColor(prev, cv2.COLOR_BGR2GRAY)
show_hsv = False
show_glitch = False
cur_glitch = prev.copy()

frame_idx = 0

while True:
    ret, img = cam.read()
    img = hud.prepare_frame(img)
    orig = img.copy()
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    flow = cv2.calcOpticalFlowFarneback(prevgray, gray, None, 0.5, 3, 15, 1, 5, 1.2, 0)
    prevgray = gray
    frame_idx += 1

    if frame_idx % 1 == 0:
        hud.get_hud(orig, None, frame_idx)
        mask = np.zeros_like(orig)
        mask = draw_flow(mask, flow)
        cv2.addWeighted(orig, 1, mask, 0.3, 1, dst=orig)
        cv2.imshow('flow', orig)

    ch = cv2.waitKey(5)
    if ch == 27:
        break
    if ch == ord('1'):
        show_hsv = not show_hsv
        print('HSV flow visualization is', ['off', 'on'][show_hsv])
    if ch == ord('2'):
        show_glitch = not show_glitch
        if show_glitch:
            cur_glitch = img.copy()
        print('glitch is', ['off', 'on'][show_glitch])
cv2.destroyAllWindows()
