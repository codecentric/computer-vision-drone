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

Accessing the properties of an image:```img.shape``` returns a tuple of numbers or rows, columns and channels, ```img.size``` returns the total number of pixels, and ```img.dtype``` gives the image datatype.

