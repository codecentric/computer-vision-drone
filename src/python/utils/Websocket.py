import json
import threading
import websocket
from config.drone_config import *


class WebsocketClient(object):
    WS = None

    def __init__(self):
        self.WS = websocket.WebSocketApp(CONF.WS_URL,
                                         on_open=self.on_open,
                                         on_error=self.on_error,
                                         on_close=self.on_close)
        thread = threading.Thread(target=self.run, args=())
        thread.daemon = True  # Daemonize thread
        thread.start()

    def run(self):
        print("run websocket")
        self.WS.run_forever()

    def on_message(self, ws, message):
        print("on_message")
        print (message)

    def on_error(self, ws, error):
        print (error)

    def on_close(self, ws):
        print ("### closed ###")

    def on_open(self, ws):
        # runOCV(self.ws)
        ws.send(json.dumps({'function': 'autoPilot', 'args': ['false']}))
        print ('connection opend')

    def send(self, message):
        print("sending message to ws {}".format(message))
        self.WS.send(message)
