# Install OpenCV 3.2 Ubuntu on AWS GPU instances with CUDA Support

To test some state of the art Convolutional Neural Networks (CNNs) we need CUDA support. 

<div class="alert">
WARNING: running your GPU instance on AWS will create costs. Make sure you stop it, when you don't 
need it anymore.
</div>

## Setup AWS instance

* Login to your AWS console. Select EU-Ireland as your location.
* Goto Services / EC2
* Click on Launch Instance
* Select "Ubuntu Server 16.04 LTS (HVM), SSD Volume Type"

### Select Instance type

* Select g2.2xlarge ; 
  This instance comes with 
  * 8 vCPUs 
  * 15 GB RAM and 
  * 60 GB SSD storage
  * 1536 CUDA-Cores (nvidia)
  * 4 GB Video RAM
* click configure details

### Network settings

* click "Request Spot Instances" to save money (instance price will come cheaper, but instance 
  maybe terminated at any time)
* select a network/subnet that allows Public IPs

### Storage

* Increase storage of first drive to: 30 GB general purpose SSD
* Next: add tags

### Tags

* Name it "opencv-gpu-instance"
* Next: Configure security group

### Security group

* Create a security group that allows SSH access to the machine
* Hit review and launch
* Launch
* Create and download keypair


Move your keypair
``` 
mv ~/Downloads/gpu-instance.pem ~/.ssh/
chmod 600 ~/.ssh/gpu-instance.pem
ssh-add ~/.ssh/gpu-intance.pem
```

Test ssh connection (get public ip of your instance from AWS GUI)
``` 
ssh ubuntu@54.171.225.XXX
Welcome to Ubuntu 16.04.1 LTS (GNU/Linux 4.4.0-59-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

  Get cloud support with Ubuntu Advantage Cloud Guest:
    http://www.ubuntu.com/business/services/cloud

0 packages can be updated.
0 updates are security updates.

```

### Update system

``` 
sudo -i
apt-get update
apt-get dist-upgrade
reboot
```

## Setup OS dependencies

``` 
apt-get install -y gcc g++ gfortran build-essential \
        git wget linux-image-generic libopenblas-dev \
        python-dev python-pip python-nose python-numpy \
        python-scipy liblapack-dev libblas-dev cmake unzip \
        pkg-config libopenblas-dev linux-source linux-headers-generic \
        python3 python3-pip

```

### setup cuda 8.0

```
mkdir /mnt/tmp
cd /mnt/tmp
wget https://developer.nvidia.com/compute/cuda/8.0/prod/local_installers/cuda_8.0.44_linux-run
sh cuda_8.0.44_linux-run

...

Install NVIDIA Accelerated Graphics Driver for Linux-x86_64 367.48?
(y)es/(n)o/(q)uit: y

Do you want to install the OpenGL libraries?
(y)es/(n)o/(q)uit [ default is yes ]: y

Install the CUDA 8.0 Toolkit?
(y)es/(n)o/(q)uit: y

Enter Toolkit Location
 [ default is /usr/local/cuda-8.0 ]:

Do you want to install a symbolic link at /usr/local/cuda?
(y)es/(n)o/(q)uit: y

Install the CUDA 8.0 Samples?
(y)es/(n)o/(q)uit: y

Enter CUDA Samples Location
 [ default is /home/ubuntu ]: 

...

===========
= Summary =
===========

Driver:   Installed
Toolkit:  Installed in /usr/local/cuda-8.0
Samples:  Installed in /home/ubuntu, but missing recommended libraries

Please make sure that
 -   PATH includes /usr/local/cuda-8.0/bin
 -   LD_LIBRARY_PATH includes /usr/local/cuda-8.0/lib64, or, add /usr/local/cuda-8.0/lib64 to /etc/ld.so.conf and run ldconfig as root

```

Setup paths

```
echo "/usr/local/cuda-8.0/lib64" >> /etc/ld.so.conf
ldconfig
echo 'PATH=$PATH:/usr/local/cuda-8.0/bin' >> /etc/profile

# logout, login
```
### setup cuDNN

To install cuDNN you need an nvidia developer account.

```
scp Downloads/cudnn-8.0-linux-x64-v5.1.tgz ubuntu@YOUR_PUB_IP:~
ssh ubuntu@YOUR_PUB_IP
tar -xvf cudnn-8.0-linux-x64-v5.1.tgz 

sudo cp cuda/lib64/* /usr/local/cuda/lib64
sudo cp cuda/include/* /usr/local/cuda/include/
```


## setup virtualenvs

``` 
export LC_ALL=POSIX
pip3 install virtualenv virtualenvwrapper
pip3 install --upgrade pip

echo "export WORKON_HOME=$HOME/.virtualenvs" >> ~/.bashrc
echo "source /usr/local/bin/virtualenvwrapper.sh" >> ~/.bashrc
source ~/.bashrc

mkvirtualenv computer-vision -p python3
pip install numpy scipy scikit-image imutils matplotlib

```

## install opencv 3.2

```
wget -O opencv.zip https://github.com/Itseez/opencv/archive/3.2.0.zip
wget -O opencv_contrib.zip https://github.com/Itseez/opencv_contrib/archive/3.2.0.zip
unzip opencv.zip
unzip opencv_contrib.zip


mkdir ~/opencv-3.2.0/build
cd ~/opencv-3.2.0/build

workon computer-vision

cmake -D CMAKE_BUILD_TYPE=RELEASE \
    -D CMAKE_INSTALL_PREFIX=/usr/local \
    -D WITH_CUDA=ON \
    -D ENABLE_FAST_MATH=1 \
    -D CUDA_FAST_MATH=1 \
    -D WITH_CUBLAS=1 \
    -D INSTALL_PYTHON_EXAMPLES=ON \
    -D OPENCV_EXTRA_MODULES_PATH=../../opencv_contrib-3.2.0/modules \
    -D BUILD_EXAMPLES=ON ..
    
```

Result should be like this:
```

--   NVIDIA CUDA
--     Use CUFFT:                   YES
--     Use CUBLAS:                  YES
--     USE NVCUVID:                 NO
--     NVIDIA GPU arch:             20 30 35 37 50 52 60 61
--     NVIDIA PTX archs:
--     Use fast math:               YES
-- 
...
--   Python 3:
--     Interpreter:                 /home/ubuntu/.virtualenvs/computer-vision/bin/python3 (ver 3.5.2)
--     Libraries:                   /usr/lib/x86_64-linux-gnu/libpython3.5m.so (ver 3.5.2)
--     numpy:                       /home/ubuntu/.virtualenvs/computer-vision/lib/python3.5/site-packages/numpy/core/include (ver 1.12.0)
--     packages path:               lib/python3.5/site-packages
-- 

```

### compile and install opencv

```
make -j8
sudo make install
sudo ldconfig
```

If the build crashes on:
``` 
[ 27%] Building CXX object modules/core/CMakeFiles/opencv_core.dir/src/hal_internal.cpp.o
In file included from /home/ubuntu/opencv-3.2.0/modules/core/src/hal_internal.cpp:49:0:
/home/ubuntu/opencv-3.2.0/build/opencv_lapack.h:2:45: fatal error: LAPACKE_H_PATH-NOTFOUND/lapacke.h: No such file or directory
compilation terminated.
modules/core/CMakeFiles/opencv_core.dir/build.make:361: recipe for target 'modules/core/CMakeFiles/opencv_core.dir/src/hal_internal.cpp.o' failed
make[2]: *** [modules/core/CMakeFiles/opencv_core.dir/src/hal_internal.cpp.o] Error 1
make[2]: *** Waiting for unfinished jobs....

```

run:
```
sudo apt-get install liblapacke-dev checkinstall
```
and try again.

