# opencv resize image

Accessing the properties of an image:

* ```img.shape``` returns a tuple of numbers of rows, columns and channels, 
* ```img.size``` returns the total number of pixels, and 
* ```img.dtype``` gives the image datatype.

An image can be resized with:
 
```python
img2 = cv2.resize(img, None, fx=0.5, fy=0.5, interpolation = cv2.INTER_AREA)
```

Here, ```fx``` and ```fy``` denote the factors by which the image is rescaled 
in the x and y direction, i.e. in this example the image is shrunk by half. 

* ```interpolation``` denotes the interpolation method used: ```cv2.INTER_AREA``` is recommended for shrinking, 
* while ```cv2.INTER_CUBIC``` and ```cv2.INTER_LINEAR``` can be used for zooming, the latter being significantly faster.
