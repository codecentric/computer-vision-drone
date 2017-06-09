import json
import threading

import websocket


class WebsocketClient(object):
    WS = None

    def __init__(self):
        websocket.enableTrace(True)
        self.WS = websocket.WebSocketApp("ws://localhost:8000/",
                                         #on_message=self.on_message,
                                         on_open=self.on_open,
                                         on_error=self.on_error,
                                         on_close=self.on_close)
        thread = threading.Thread(target=self.run, args=())
        thread.daemon = True  # Daemonize thread
        thread.start()

    def run(self):
        self.WS.run_forever()

    def on_message(self, ws, message):
        print message

    def on_error(self, ws, error):
        print error

    def on_close(self, ws):
        ws.send(json.dumps({'function': 'autoPilot', 'args': ['true']}))
        print "### closed ###"

    def on_open(self, ws):
        # runOCV(self.ws)
        ws.send(json.dumps({'function': 'autoPilot', 'args': ['false']}))
        print ('connection opend')

    def send(self, message):
        self.WS.send(message)