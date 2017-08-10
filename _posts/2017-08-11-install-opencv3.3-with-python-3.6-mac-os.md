# Installing OpenCV 3.3 with Python 3.6.2 on MacOS Sierra 10.12

OpenCV 3.3 is out since August 2017. It comes with an optimized DNN module - so I want 
to take a "Deep" look at it.

## Installation

### Update Python, create virtualenv

```
brew uprade python3

brew install cmake pkg-config jpeg libpng libtiff openexr eigen tbb

mkvirtualenv cv33_p3 -p python3

pip install numpy matplotlib scikit-image
```

(^ Make sure you are in the newly created virtual env.)

### Download Sources

```
cd ~
mkdir opencv-source
cd opencv-source

wget -O opencv.zip https://github.com/opencv/opencv/archive/3.3.0.zip
wget -O opencv_contrib.zip https://github.com/opencv/opencv_contrib/archive/3.3.0.zip

unzip opencv.zip
unzip opencv_contrib.zip

```

### Compile Sources

I install opencv3.3 into a seperate (non standard) /usr/local/openc3.3 so it does not conflict with my current 
development in opencv 3.2.

```
cd opencv-3.3.0/
mkdir build
cd build

cmake -D CMAKE_BUILD_TYPE=RELEASE \
 -D CMAKE_INSTALL_PREFIX=/usr/local/opencv3.3 \
 -D OPENCV_EXTRA_MODULES_PATH=~/work/opencv-source/opencv_contrib-3.3.0/modules \
 -D PYTHON3_LIBRARY=/usr/local/Cellar/python3/3.6.2/Frameworks/Python.framework/Versions/3.6/lib/python3.6/config-3.6m-darwin/libpython3.6.dylib \
 -D PYTHON3_INCLUDE_DIR=/usr/local/Cellar/python3/3.6.2/Frameworks/Python.framework/Versions/3.6/include/python3.6m/ \
 -D PYTHON3_EXECUTABLE=$VIRTUAL_ENV/bin/python \
 -D BUILD_opencv_python3=ON \
 -D WITH_CUDA=OFF \
 -D BUILD_EXAMPLES=ON ..
```

(Make sure it finds your python3  Interpreter/ Library / numpy)

Output should look something like this:

```

--   Media I/O: 
--     ZLib:                        build (ver 1.2.8)
--     JPEG:                        build (ver 90)
--     WEBP:                        /usr/local/lib/libwebp.dylib (ver encoder: 0x020e)
--     PNG:                         build (ver 1.6.24)
--     TIFF:                        build (ver 42 - 4.0.2)
--     JPEG 2000:                   build (ver 1.900.1)
--     OpenEXR:                     build (ver 1.7.1)
--     GDAL:                        NO
--     GDCM:                        NO
-- 
--   Video I/O:
--     DC1394 1.x:                  NO
--     DC1394 2.x:                  YES (ver 2.2.2)
--     FFMPEG:                      YES
--       avcodec:                   YES (ver 57.89.100)
--       avformat:                  YES (ver 57.71.100)
--       avutil:                    YES (ver 55.58.100)
--       swscale:                   YES (ver 4.6.100)
--       avresample:                YES (ver 3.5.0)
--     GStreamer:                   NO
--     OpenNI:                      NO
--     OpenNI PrimeSensor Modules:  NO
--     OpenNI2:                     NO
--     PvAPI:                       NO
--     GigEVisionSDK:               NO
--     Aravis SDK:                  NO
--     AVFoundation:                YES
--     V4L/V4L2:                    NO/NO
--     XIMEA:                       NO
--     Intel Media SDK:             NO
--     gPhoto2:                     NO
-- 
--   Parallel framework:            GCD
-- 
--   Trace:                         YES (with Intel ITT)
-- 
--   Other third-party libraries:
--     Use Intel IPP:               2017.0.2 [2017.0.2]
--                at:               /Users/user/work/opencv-source/opencv-3.3.0/build/3rdparty/ippicv/ippicv_mac
--     Use Intel IPP IW:            prebuilt binaries (2017.0.2)
--     Use Intel IPP Async:         NO
--     Use VA:                      NO
--     Use Intel VA-API/OpenCL:     NO
--     Use Lapack:                  YES (/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX10.12.sdk/System/Library/Frameworks/Accelerate.framework /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX10.12.sdk/System/Library/Frameworks/Accelerate.framework)
--     Use Eigen:                   YES (ver 3.3.4)
--     Use Cuda:                    NO
--     Use OpenCL:                  YES
--     Use OpenVX:                  NO
--     Use custom HAL:              NO
-- 
--   OpenCL:                        <Link with OpenCL library>
--     Link libraries:              -framework OpenCL
--     Use AMDFFT:                  NO
--     Use AMDBLAS:                 NO
-- 
--   Python 2:
--     Interpreter:                 /usr/local/bin/python2.7 (ver 2.7.13)
-- 
--   Python 3:
--     Interpreter:                 /Users/user/.virtualenvs/cv33_p3/bin/python (ver 3.6.2)
--     Libraries:                   /usr/local/Cellar/python3/3.6.2/Frameworks/Python.framework/Versions/3.6/lib/python3.6/config-3.6m-darwin/libpython3.6.dylib (ver 3.6.2)
--     numpy:                       /Users/user/.virtualenvs/cv33_p3/lib/python3.6/site-packages/numpy/core/include (ver 1.13.1)
--     packages path:               lib/python3.6/site-packages
-- 
--   Python (for build):            /usr/local/bin/python2.7
-- 
--   Java:
--     ant:                         /usr/local/bin/ant (ver 1.10.1)
--     JNI:                         /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX10.12.sdk/System/Library/Frameworks/JavaVM.framework/Headers /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX10.12.sdk/System/Library/Frameworks/JavaVM.framework/Headers /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX10.12.sdk/System/Library/Frameworks/JavaVM.framework/Headers
--     Java wrappers:               YES
--     Java tests:                  YES
-- 
--   Matlab:                        Matlab not found or implicitly disabled
-- 
--   Documentation:
--     Doxygen:                     NO
-- 
--   Tests and samples:
--     Tests:                       YES
--     Performance tests:           YES
--     C/C++ Examples:              YES
-- 
--   Install path:                  /usr/local/opencv3.3
-- 
--   cvconfig.h is in:              /Users/user/work/opencv-source/opencv-3.3.0/build
-- -----------------------------------------------------------------
-- 
-- Configuring done
-- Generating done
```


```
make -j4
sudo make install
``` 

copy so file in your virtualenv

```
cp /usr/local/opencv3.3/lib//python3.6/site-packages/cv2.cpython-36m-darwin.so \
 ~/.virtualenvs/cv33_p3/lib/python3.6/site-packages/cv2.so
```

test:

``` 
$ python
Python 3.6.2 (default, Aug 10 2017, 09:30:17) 
[GCC 4.2.1 Compatible Apple LLVM 8.1.0 (clang-802.0.42)] on darwin
Type "help", "copyright", "credits" or "license" for more information.
>>> import cv2
>>> cv2.__version__
'3.3.0'

```

