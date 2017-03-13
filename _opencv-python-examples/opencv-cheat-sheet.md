# opencv cheat sheet

## Getting Started with Images
Import OpenCV and numpy

```python
import cv2
import numpy
```

A condensed overview of the following can be found in the
[Cheat Sheet](OpenCVCheatSheet.pdf)

## basics

[read or save image](opencv-read-and-save-images.md) : ```cv2.imshow('name of window', img)```

[rotate image](opencv-rotate-image.md) : ```rotated_image = imutils.rotate(image, 90)```  

[resize_image](opencv-resize-image.md) : ```img2 = cv2.resize(img, None, fx=0.5, fy=0.5, interpolation = cv2.INTER_AREA)```

[change parts of image](opencv-change-parts-of-image.md)

[split or merge channels](opencv-split-merge-channels.md)

[Add a border to an image](opencv-add-border.md)

[Convert colorspaces](opencv-convert-colorspaces.md)

[Warp image](opencv-warp-image.md)

### Image filtering
Thresholding selects pixels in a gray scale image whose intensity is larger (or smaller) than a threshold and assigns a new value to them:


Add, subtract, blend images images
Bitwise operations
PCA, SVD, ...


`````` `````` `````` `````` `````` `````` ``````
