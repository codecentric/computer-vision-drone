# Add a border to an image
```python
img2 = cv2.copyMakeBorder(img, top, bottom, left, right, borderType)
```
Here, ```img``` ist the original image, ```top```, ```bottom```, ```left```, and ```right``` are the widths of the border in the corresponding direction, and ```borderType``` denotes the kind of border:
* ```cv2.BORDER_CONSTANT``` constant colored border. Requires additional parameter giving the color, e.g. ```value=[255,0,0]``` for a blue border
* ```cv2.BORDER_REFLECT``` reflection of image border, e.g. left border will be columns 0 to left-1 of image in reversed order
* ```cv2.BORDER_REFLECT_101``` or ```cv2.BORDER_DEFAULT``` reflection of image border, e.g. left border will be columns 1 to left of image in reversed order
* ```cv2.BORDER_REPLICATE``` repeat outermost element, e.g left border is column 0 repeated left times
* ```cv2.BORDER_WRAP``` periodic boundary conditions, e.g. right border will be columns 0 to left-1 of image
