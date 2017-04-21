# Opencv cheat sheet

## Getting Started with Images
Import OpenCV and numpy

```python
import cv2
import numpy
```

A condensed overview of the following can be found in the
[Cheat Sheet](OpenCVCheatSheet.pdf)

## Basics

[Read or save image](../_pages/opencv-python-examples/opencv-read-and-save-images.md) : ```cv2.imshow('name of window', img)```

[Rotate image](../_pages/opencv-python-examples/opencv-rotate-image.md) : ```rotated_image = imutils.rotate(image, 90)```  

[Resize_image](../_pages/opencv-python-examples/opencv-resize-image.md) : ```img2 = cv2.resize(img, None, fx=0.5, fy=0.5, interpolation = cv2.INTER_AREA)```

[Change parts of image](../_pages/opencv-python-examples/opencv-change-parts-of-image.md)

[Split or merge channels](../_pages/opencv-python-examples/opencv-split-merge-channels.md)

[Add a border to an image](../_pages/opencv-python-examples/opencv-add-border.md)

[Convert colorspaces](../_pages/opencv-python-examples/opencv-convert-colorspaces.md)

[Warp image](../_pages/opencv-python-examples/opencv-warp-image.md)

### Image filtering
Thresholding selects pixels in a gray scale image whose intensity is larger (or smaller) than a threshold and assigns a new value to them.
