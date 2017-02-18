# Estimating drone movement vectors with opencv and opticalflow

The drones internal gps and acceleration sensors work quite well. It is also easily possible to 
read those sensors via the API. But when issuing a stop command, the drone keeps drifting a little bit. 

For a Proof of Concept we want to try to estimate the movement vectors of the drone by analysing 
the video signal. The idea is easy - if all pixels move to the right, the drone must be turning 
or moving left somehow. 

According to the OpenCV documentation Optical Flow is defined as:

> "... Optical flow is a pattern of apparent motion of image objects between two consecutive 
frames caused by the movement of an object or camera. It is a 2D vector field where each vector 
is a displacement vector showing the movement of points from first frame to second..."

-- <cite>(http://docs.opencv.org/3.2.0/d7/d8b/tutorial_py_lucas_kanade.html)</cite>

Checkout this video for a demo:

![opencv optical flow demo](http://img.youtube.com/vi/tWo1LEBkMjI/0.jpg)](http://www.youtube.com/watch?v=tWo1LEBkMjI)


## Conclusion

Using optical flow to estimate the movement vectors of a drone is possible. But it is a compute 
intensive task that cannot run on a Raspy in realtime. You also need to consider many things like 
distance and moving objects and you can't just add all the movement vectors.

An interesting task could be to records the movement vectors and correlate them with the measurements 
from the drones sensors. Like this we could create a machine learning model and learn how to estimate 
the vectors from a video signal.
