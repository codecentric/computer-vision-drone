# Sources

## How to setup the Raspberry PI

This are the instructions how to setup the raspberry PI for our usage.

Please note: These instructions may differ for other PI versions than Version 3 Model B.

 
### Install Raspbian on th PI

We suggest to install Raspbian via the NOOBS installer. This is well described here:

https://www.raspberrypi.org/downloads/noobs/

After that you should have a running Raspbian installation on your PI.

### Configure the PI

Please do the following to configure your PI:

- Run `sudo raspi-config` and change the password (default for "pi" is "raspberry")
- Connect the PI to your wireless network
- Run `sudo raspi-config` and enable SSH ("Advanced Options" -> "SSH")
- Optional: run `sudo apt-get install vim`
- Reboot your PI
- Clone our repository:  
  `cd /home/pi/`  
  `git clone https://github.com/codecentric/computer-vision-drone.git`

## Install required frameworks

### Install node.js

There are different ways to install node.js on the PI. Maybe you want to do it like this:

`curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -`  
`sudo apt-get install nodejs`


### Install node.js modules

Install the HC-SR04 sensor module:

`npm install mmm-usonic --save`

  

## Frameworks

* opencv
* dlib
