# opencv split and merge channels

In opencv the default color scheme is BGR (Blue, Green, Red) (not RGB!).
Different channels of an image can be accessed:

```python
blue, green, red = cv2.split(image)
image = cv2.merge((blue, green, red))
```


Again, numpy array methods are significantly more efficient, e.g.,

```python
green = image[:,:,1]
```
