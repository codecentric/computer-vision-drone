import cv2
import glob


for f in glob.glob("/Users/omoser/work/yolo/*.jpg"):
    print(f)

    frame = cv2.imread(f)
    cv2.imshow("yolo", frame)
    cv2.waitKey(1)



