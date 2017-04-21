# Opencv cheat sheet

## Getting Started with Images
Import OpenCV and numpy

```python
import cv2
import numpy
```

A condensed overview of the following can be found in the
[Cheat Sheet](./_pages/opencv-python-examples/OpenCVCheatSheet.pdf)

## Basics

[Read or save image](http://cvdrone.de/_pages/opencv-python-examples/opencv-read-and-save-images/) : ```cv2.imshow('name of window', img)```

[Rotate image](http://cvdrone.de/_pages/opencv-python-examples/opencv-rotate-image/) : ```rotated_image = imutils.rotate(image, 90)```  

[Resize_image](http://cvdrone.de/_pages/opencv-python-examples/opencv-resize-image/) : ```img2 = cv2.resize(img, None, fx=0.5, fy=0.5, interpolation = cv2.INTER_AREA)```

[Change parts of image](http://cvdrone.de/_pages/opencv-python-examples/opencv-change-parts-of-image/)

[Split or merge channels](http://cvdrone.de/_pages/opencv-python-examples/opencv-split-merge-channels/)

[Add a border to an image](http://cvdrone.de/_pages/opencv-python-examples/opencv-add-border/)

[Convert colorspaces](http://cvdrone.de/_pages/opencv-python-examples/opencv-convert-colorspaces/)

[Warp image](http://cvdrone.de/_pages/opencv-python-examples/opencv-warp-image/)

### Image filtering
Thresholding selects pixels in a gray scale image whose intensity is larger (or smaller) than a threshold and assigns a new value to them.
