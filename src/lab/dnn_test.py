import cv2
from cv2 import dnn

inWidth = 300
inHeight = 300
WHRatio = inWidth / float(inHeight)
inScaleFactor = 0.007843
meanVal = 127.5

classNames = ('background',
              'aeroplane', 'bicycle', 'bird', 'boat',
              'bottle', 'bus', 'car', 'cat', 'chair',
              'cow', 'diningtable', 'dog', 'horse',
              'motorbike', 'person', 'pottedplant',
              'sheep', 'sofa', 'train', 'tvmonitor')

# you have to download the 2 files from
net = dnn.readNetFromCaffe("./MobileNetSSD.prototxt", "./MobileNetSSD_deploy.caffemodel")

cap = cv2.VideoCapture("/Users/omoser/work/computer-vision-drone/src/python/config/bebop.sdp")
cap = cv2.VideoCapture("/Users/omoser/data/testvideos/test_small.mp4")

while cap.isOpened():

    ret, frame = cap.read()
    blob = dnn.blobFromImage(frame, inScaleFactor, (inWidth, inHeight), meanVal)
    net.setInput(blob)
    detections = net.forward()

    cols = frame.shape[1]
    rows = frame.shape[0]

    if cols / float(rows) > WHRatio:
        cropSize = (int(rows * WHRatio), rows)
    else:
        cropSize = (cols, int(cols / WHRatio))

    y1 = int((rows - cropSize[1]) / 2)
    y2 = int(y1 + cropSize[1])
    x1 = int((cols - cropSize[0]) / 2)
    x2 = int(x1 + cropSize[0])

    print(x1, x2, y1, y2)
    frame = frame[y1:y2, x1:x2]

    cols = frame.shape[1]
    rows = frame.shape[0]

    for i in range(detections.shape[2]):
        confidence = detections[0, 0, i, 2]
        if confidence > 0.3:
            class_id = int(detections[0, 0, i, 1])

            xLeftBottom = int(detections[0, 0, i, 3] * cols)
            yLeftBottom = int(detections[0, 0, i, 4] * rows)
            xRightTop   = int(detections[0, 0, i, 5] * cols)
            yRightTop   = int(detections[0, 0, i, 6] * rows)

            cv2.rectangle(frame, (xLeftBottom, yLeftBottom), (xRightTop, yRightTop),
                          (0, 255, 0))
            label = classNames[class_id] + ": " + str(confidence)
            labelSize, baseLine = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1)

            cv2.rectangle(frame, (xLeftBottom, yLeftBottom - labelSize[1]),
                                 (xLeftBottom + labelSize[0], yLeftBottom + baseLine),
                                 (255, 255, 255), cv2.FILLED)
            cv2.putText(frame, label, (xLeftBottom, yLeftBottom),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0))

    cv2.imshow("detections", frame)
    cv2.moveWindow("detections", 0, 0)
    if cv2.waitKey(1) >= 0:
        break