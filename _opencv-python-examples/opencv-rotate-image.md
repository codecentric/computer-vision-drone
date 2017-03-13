# opencv rotate image

There are several options to rotate an image in opencv. The most convenient is probably using the 
imutils library.

## rotate image using imutils

The following code will rotate the image by 90 degrees:

``` python
import cv2
import imutils

image = cv2.imread('test.png', 0)
rotated_image = imutils.rotate(image, 90) 

```

## rotate image using warpAffine and rotation matrix

The following code will rotate the image by 45 degrees:

``` python
image = cv2.imread('test.png', 0)
rows, cols = image.shape
M = cv2.getRotationMatrix2D((cols/2, rows/2), 45, 1)
rotated_image = cv2.warpAffine(image, M, (cols, rows))
```

