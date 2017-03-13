# opencv change parts of an image

Individual pixel values can be accessed and modified by row and column coordinates, i.e.
```img[y, x]``` is either a triplet, e.g. of blue, green and red values for a BGR image, or the intensity for a gray scale image. As a faster alternative, numpy array methods should be used:
 
```python
image.item(y, x, 2)  # access the red value of pixel x,y for a BGR image
image.itemset((y, x, 2), 100) # set the red value of pixel x,y to 100
```

Note that the row and column indices, ```y``` and ```x``` start in the upper left corner of the image, making it a somewhat unintuitive choice of coordinate system.

A region of interest in an image can be selected by standard index slicing methods:

```python
image[y_min:y_max, x_min:x_max]
```
