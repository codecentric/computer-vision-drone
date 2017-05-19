import cv2

# initialisiere Webcam
cam = cv2.VideoCapture(0)

# definiere farb ranges
lower_yellow = (18, 100, 210)
upper_yellow = (40, 160, 245)

# zeige stream von WebCam an
while cam.isOpened():
    # lese frame von WebCam
    ret, frame = cam.read()

    # konvertiere frame in HSV Farbraum, um besser nach Farb Ranges filtern zu können
    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

    # filtere bild nach farb grenzen
    mask = cv2.inRange(frame, lower_yellow, upper_yellow)

    # finde Konturen in der Maske, die nur noch zeigt, wo gelbe Pixel sind:
    _, contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL,
                                      cv2.CHAIN_APPROX_SIMPLE)

    # suche die größte contour heraus (diese ist höchst wahrscheinlich der Tennis Ball)
    # dazu nehmen wir die Fläche der Kontur:
    if len(contours) > 0:
        tennis_ball = max(contours, key=cv2.contourArea)

        # zeichne die Bounding box des tennis balls in das Video Bild ein:
        x, y, w, h = cv2.boundingRect(tennis_ball)
        cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), thickness=3)

    # zeige Frame an
    cv2.imshow("frame", frame)

    # warte auf Tastendruck (sonst sieht man das fenster nicht)
    key = cv2.waitKey(1) & 0xff

    # wenn ESC gedrückt beende programm
    if key == 27:
        break
