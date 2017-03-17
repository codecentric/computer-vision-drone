import cv2


class VideoWriter:
    def __init__(self, capture, out_file="/tmp/video.mp4", codec="X264"):
        self.fourcc = cv2.VideoWriter_fourcc(*codec)
        self.out_file = out_file
        self.capture = capture
        self.writer = None

    def write(self, frame):
        if self.writer is None:
            h, w = frame.shape[:2]
            fps = self.capture.get(cv2.CAP_PROP_FPS)
            self.writer = cv2.VideoWriter(self.out_file, self.fourcc, fps, (w, h), True)

        self.writer.write(frame)

    def __del__(self):
        self.writer.release()

