# opencv read and save images

## read image from disk

```python
img = cv2.imread('path', flag)
```

reads the image from the path provided. Here, ```flag = cv2.IMREAD_COLOR, cv2.IMREAD_GRAYSCALE, cv2.IMREAD_UNCHANGED``` determines whether the image is read as color, grayscale or as such, i.e. including the [alpha channel](http://www.howtogeek.com/howto/42393/rgb-cmyk-alpha-what-are-image-channels-and-what-do-they-mean/). Alternatively, the flag can be specified as an integer, i.e. ```flag = 1,0,-1```.

An image can be displayed in a named window:

```python
cv2.imshow('name of window', img)
```

Not suprisingly, the first argument is the name of the window and the second one the image to be displayed. In order to admire the image on screen you need to tell OpenCV to wait for a key to be pressed:

```python
k = cv2.waitKey(delay=0) & 0xff
if k == 27:
    cv2.destroyAllWindows()
```

```delay``` is the lag in milliseconds, 0 means wait forever, ```& 0xff``` is needed on 64-Bit machines. if the esc-key is pressed (```k==27```) the opened window is destroyed. To be precise, ```cv2.destroyAllWindows()``` closes all open windows. A single named window can be closed with ```cv2.destroyWindow('name of window')```.

## save image to disk

```python
cv2.imwrite('path',img)
```
