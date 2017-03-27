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

### Network config

Setup the network

- sudo nano `/etc/wpa_supplicant/wpa_supplicant_bebop.conf`
- paste the following code:
    ```
    ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
    update_config=1
    country=GB

    network={
             ssid="Bebop2-065599"
             key_mgmt=NONE
     }
     ```
- `ctrl + x` then `y` to save
-  make sure that the following code is at the end of `/etc/network/interfaces`
    ```
    iface wlan1 inet manual
    wpa-conf /etc/wpa_supplicant/wpa_supplicant_bebop.conf
    ```

## Install required frameworks

### Install node.js

There are different ways to install node.js on the PI. Maybe you want to do it like this:

`curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -`  
`sudo apt-get install nodejs`

For Voice commands install:
`sudo apt-get install sox`
`sudo apt-get install libatlas-base-dev`
If having problems with the microphone maybe this command can help:
`export AUDIODEV=hw:1,0`

### Install node.js modules

First, switch in the root directory of the project. Then do the following:

Install the HC-SR04 sensor module:
`npm install mmm-usonic --save`  

Install the wiring-pi module:
`npm install wiring-pi --save`

Install the node-bebop module:
`npm install node-bebop --save`
`npm install git://github.com/hybridgroup/node-bebop/feature/firmware-4.0 --save`

Install the net-ping module:
`npm install net-ping`
  
Install the snowboy module:
`npm install --save snowboy`
`npm install --save node-record-lpcm16`
## Frameworks

* opencv
* dlib
