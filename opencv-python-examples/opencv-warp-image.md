### Image warping
Affine transformations, i.e. translation, scaling, rotation, shear mapping, are implemented by passing a 2x3 matrix 
to ```cv2.warpAffine```. The first two columns of the matrix encode scaling, rotation and shear and the last column 
the translation.
Example of a translation by 100 pixels in x and y:
```python
rows, columns = img.shape[0:2]

# transformation matrix:
U = numpy.float32([[1,0,100],[0,1,100]])

img2 = cv2.warpAffine(img, U, (columns,rows))
```
The first argument of ```cv2.warpAffine``` is the image to be transformed, the second the transformation matrix 
and the third the size of the output image. A more complex scaled rotation ca be characterized by a rotation angle, 
the point around which to rotate and a scale. The function ```cv2.getRotationMatrix2D``` returns the transformation 
matrix needed for the affine transformation:
```python
U = cv2.getRotationMatrix2D((x,y),theta,scale)
```
Here, ```(x,y)``` is the coordinate of the center of rotation, ```theta``` the angle, and ```scale``` the scale.

Alternatively, an affine transformation can be defined by explicitly defining the mapping for a set of three points:
```python
orig_points = numpy.float32([[0,0],[100,100],[50,200]])
trans_points = numpy.float32([[100,100],[100,100],[100,250]])

U = cv2.getAffineTransform(orig_points, trans_points)

img2 = cv2.warpAffine(img, U, (columns,rows))
```
Here, ```cv2.getAffineTransform``` returns the corresponding transformation matrix.

Similarly, a perspective transformation can be defined by explicitly specifying the mapping for a set of four points. 
```cv2.getPerspectiveTransform``` then yields the corresponding 3x3 transformation matrix:
```python
orig_points = numpy.float32([[100,100],[650,850],[500,0],[0,900]])
trans_points = numpy.float32([[0,0],[600,600],[600,0],[0,600]])

U = cv2.getPerspectiveTransform(orig_points, trans_points)

img2 = cv2.warpPerspective(img, U, (600,600))
```
Here again, the first argument in ```cv2.warpPerspective``` is the image to be warped, the second the transformation 
matrix, and the third the size of the output image.
