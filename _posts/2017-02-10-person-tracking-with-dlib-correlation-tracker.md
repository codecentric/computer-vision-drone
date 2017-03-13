# Person tracking with dlib correlation tracker

[![IMAGE ALT TEXT](http://img.youtube.com/vi/sUv0HjpVgd8/0.jpg)](http://www.youtube.com/watch?v=sUv0HjpVgd8 "Video Title")

We want to track persons in realtime. To detect a person you have multiple options. 
We evaluated the following methods:

* HOG detector (Histogram of oriented Gradients)
* Haar Cascasde Classifier

Both methods require to scan each the whole frame with a sliding window. The algorithm
then tries to find the features of a person in each window position. These methods 
are too expensive to perform in each frame if we want to run our person tracker on 
restricted hardware like a Raspberry Pi.

For this reason we combine the person detector with a correlation tracker. The correlation 
tracker expects a region of interest and starts tracking the pixels inside that region. 
In subsequent frames it tries to find where the pixels have most likely moved. This is 
much faster and more robust than trying to find the person in each and every frame again.

Anyway the correlation tracker will loose its track due to fast movements or occlusions. For this 
we included a method, that checks if the tracked ROI (region of interest) contains a face. If not 
the tracker is resetted.

OpenCV comes with a variety of tracking methods including "BOOSTING", "TLD" and other 
popular tracking methods. We found that the implementation of [dlib] (http://dlib.net) is 
fast and gives best out of the box results.

Check out the test code for the [correlation tracker](../src/python/correlation-tracker.py)


