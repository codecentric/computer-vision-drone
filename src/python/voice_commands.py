import snowboy.snowboydecoder as snowboydecoder
import threading


class VoiceCommand(threading.Thread):
    def __init__(self, callback=snowboydecoder.play_audio_file):
        threading.Thread.__init__(self)
        self.model = "./detectors/count.pmdl"
        self.callback = callback
        self.detector = None

    def run(self):
        self.detector = snowboydecoder.HotwordDetector(self.model, sensitivity=0.7, audio_gain=2)
        self.detector.start(detected_callback=self.callback, sleep_time=0.03)

    def __del__(self):
        self.detector.terminate()
