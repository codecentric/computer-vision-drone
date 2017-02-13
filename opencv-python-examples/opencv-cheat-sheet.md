# opencv cheat sheet

## Getting Started with Images
Import OpenCV and numpy

```python
import cv2
import numpy
```

## basics

[read or save image](opencv-read-and-save-images.md) : ```cv2.imshow('name of window', img)```

[rotate image](opencv-rotate-image.md) : ```rotated_image = imutils.rotate(image, 90)```  

[resize_image](opencv-resize-image.md) : ```img2 = cv2.resize(img, None, fx=0.5, fy=0.5, interpolation = cv2.INTER_AREA)```

[change parts of image](opencv-change-parts-of-image.md)

[split or merge channels](opencv-split-merge-channels.md)

[Add a border to an image](opencv-add-border.md)

We can convert between different [colorspaces](http://docs.opencv.org/3.2.0/de/d25/imgproc_color_conversions.html), e.g. from BGR to gray scale, with 
```
cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
```
The whole variety of available conversions can be found [here](http://docs.opencv.org/3.2.0/d7/d1b/group__imgproc__misc.html#ga4e0972be5de079fed4e3a10e24ef5ef0)

This can also be used to convert a single color, e.g. the HSV value of green in BGR is given by:
```
green = numpy.uint8([[[0,255,0 ]]])
hsv_green = cv2.cvtColor(green,cv2.COLOR_BGR2HSV)
```

### Image warping
Affine transformations, i.e. translation, scaling, rotation, shear mapping, are implemented by passing a 2x3 matrix to ```cv2.warpAffine```. The first two columns of the matrix encode scaling, rotation and shear and the last column the translation.
Example of a translation by 100 pixels in x and y:
```
rows, columns = img.shape[0:2]

# transformation matrix:
U = numpy.float32([[1,0,100],[0,1,100]])

img2 = cv2.warpAffine(img, U, (columns,rows))
```
The first argument of ```cv2.warpAffine``` is the image to be transformed, the second the transformation matrix and the third the size of the output image. A more complex scaled rotation ca be characterized by a rotation angle, the point around which to rotate and a scale. The function ```cv2.getRotationMatrix2D``` returns the transformation matrix needed for the affine transformation:
```
U = cv2.getRotationMatrix2D((x,y),theta,scale)
```
Here, ```(x,y)``` is the coordinate of the center of rotation, ```theta``` the angle, and ```scale``` the scale.

Alternatively, an affine transformation can be defined by explicitly defining the mapping for a set of three points:
```
orig_points = numpy.float32([[0,0],[100,100],[50,200]])
trans_points = numpy.float32([[100,100],[100,100],[100,250]])

U = cv2.getAffineTransform(orig_points, trans_points)

img7 = cv2.warpAffine(img2, U, (columns,rows))
```
Here, ```cv2.getAffineTransform``` returns the corresponding transformation matrix.

Similarly, a perspective transformation ca be defined by explicitly specifying the mapping for a set of four points. ```cv2.getPerspectiveTransform``` then yields the corresponding 3x3 transformation matrix:
```
orig_points = numpy.float32([[100,100],[650,850],[500,0],[0,900]])
trans_points = numpy.float32([[0,0],[600,600],[600,0],[0,600]])

U = cv2.getPerspectiveTransform(orig_points, trans_points)

img2 = cv2.warpPerspective(img, U, (600,600))
```
Here again, the first argument in ```cv2.warpPerspective``` is the image to be warped, the second the transformation matrix, and the third the size of the output image.

### Image filtering
Thresholding selects pixels in a gray scale image whose intensity is larger (or smaller) than a threshold and assigns a new value to them:


Add, subtract, blend images images
Bitwise operations
PCA, SVD, ...


`````` `````` `````` `````` `````` `````` ``````
