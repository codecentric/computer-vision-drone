

### Setup PI

This are the instractions how to setup the raspberry PI. 

Please note: These instructions may differ for other PI versions than Version 3 Model B.

## Step 1 Installation of Raspbian

Download NOOBS from https://www.raspberrypi.org/downloads/noobs/ and extract to a preformatted (FAT32) SD-Card.
Maybe run fsck and check for formatting issues after that

Run the PI and execute the installation via the PI

### Step 2 Enable SSH

Run a shell on the PI and execute:

sudo raspi-config

Select "Advanced Options" -> "SSH -> Enabled: Yes

Reboot the PI.


### Additional:

sudo apt-get install vim

### Install node.js

curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt-get install nodejs


### Install required node.js modules

npm install mmm-usonic --save

### Clone our repository:


cd /home/pi/
git clone https://github.com/codecentric/computer-vision-drone.git

