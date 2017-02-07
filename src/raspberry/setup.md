

### Setup PI

## Step 1 Installation of Raspbian

Download NOOBS from https://www.raspberrypi.org/downloads/noobs/ and extract to a preformatted (FAT32) SD-Card.
Maybe run fsck and check for formatting issues after that

Run the PI and execute the installation via the PI


### Step 2 Enable SSH

Run a shell on the PI and execute:

sudo raspi-config

Select "Advanced Options" -> "SSH -> Enabled: Yes

Reboot the PI.

