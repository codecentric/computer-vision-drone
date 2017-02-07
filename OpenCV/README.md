# A Rough Guide to OpenCV 3.* in Python 3.*

OpenCV is an incredibly powerful tool for implementing computer vision applications in Python. However, it can
be fairly inaccessible in the begeinning. Here, we try to collect all the information we gathered in an attempt
to provide a guide on how to do certain things. This is by no means complete but, hopefully, a useful starting point.

## Getting Started with Images
Import OpenCV and numpy

```
import cv2
import numpy
```

Read an image:
```
img = cv2.imread('path', flag)
```
reads the image from the path provided. Here, ```flag = cv2.IMREAD_COLOR, cv2.IMREAD_GRAYSCALE, cv2.IMREAD_UNCHANGED``` determines whether the image is read as color, grayscale or as such, i.e. including the [alpha channel](http://www.howtogeek.com/howto/42393/rgb-cmyk-alpha-what-are-image-channels-and-what-do-they-mean/). Alternatively, the flag can be specified as an integer, i.e. ```flag = 1,0,-1```.

An image can be displayed in a named window:
```
cv2.imshow('name of window', img)
```
Not suprisingly, the first argument is the name of the window and the second one the image to be displayed. In order to admire the image on screen you need to tell OpenCV to wait for a key to be pressed:
```
k = cv2.waitKey(delay=0) & 0xff
if k == 27:
    cv2.destroyAllWindows()
```
```delay``` is the lag in milliseconds, 0 means wait forever, ```& 0xff``` is needed on 64-Bit machines. if the esc-key is pressed (```k==27```) the opened window is destroyed. To be precise, ```cv2.destroyAllWindows()``` closes all open windows. A single named window can be closed with ```cv2.destroyWindow('name of window')```.

An image can be saved to disk with
```
cv2.imwrite('path',img)
```

Accessing the properties of an image:```img.shape``` returns a tuple of numbers of rows, columns and channels, ```img.size``` returns the total number of pixels, and ```img.dtype``` gives the image datatype.

An image can be resized with 
```
img2 = cv2.resize(img, None, fx=0.5, fy=0.5, interpolation = cv2.INTER_AREA)
```
Here, ```fx``` and ```fy``` denote the factors by which the image is rescaled in the x and y direction, i.e. in this example the image is shrunk by half. ```interpolation``` denotes the interpolation method used: ```cv2.INTER_AREA``` is recommended for shrinking, while ```cv2.INTER_CUBIC``` and ```cv2.INTER_LINEAR``` can be used for zooming, the latter being significantly faster.

Individual pixel values can be accessed and modified by row and column coordinates, i.e. ```img[y,x]``` is either a triplet, e.g. of blue, green and red values for a BGR image, or the intensity for a gray scale image. As a faster alternative, numpy array methods should be used:
```
img.item(y,x,2)  # access the red value of pixel x,y for a BGR image
img.itemset((y,x,2),100) # set the red value of pixel x,y to 100
```
Note that the row and column indices, ```y``` and ```x``` start in the upper left corner of the image, making it a somewhat unintuitive choice of coordinate system.

A region of interest in an image can be selected by standard index slicing methods:
```
img[y_min:y_max, x_min:x_max]
```

