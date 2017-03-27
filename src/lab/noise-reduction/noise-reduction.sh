#!/bin/bash
# skip checking if noise sample exists (helpful for boot procedure)
SKIP=false

# length for the audio sample
time=5

# set the recording device
mic='plughw:1,0'

# background noise file
# noiseFile=noise_1_base_16.wav
noiseFile=example_noise_3.wav

# directory where the audio sample is stored
workDir='/dump/'

record()
{
    echo "Recording background noise. Keep quiet for $time seconds."
    sleep 3
    arecord -D $mic -f cd $noiseFile &
    PID=$!
    sleep $time
    kill $PID
    aplay $noiseFile
}

# start pulseaudio

pulseaudio --start

#get pulse audio devices
echo "get pulse audio devices"
devices=`pactl list | grep -E -A2 '(Source|Sink) #' | grep 'Name: ' | grep -v monitor | cut -d" " -f2`
if [ `echo "$devices" | grep -c aloop` -lt 1 ]; then
    echo "No loopback device created. Run 'sudo modprobe snd_aloop' first."
    sudo modprobe snd_aloop
    #exit
fi

cd $workDir


# check if a noise sample exists
echo "check if a noise sample exists"
    if [ -a $noiseFile ];
        then
            read -p "The noise sample file already exists! Do you want to use it?" yn
                case $yn in
                    [Yy]* ) break;;
                    [Nn]* ) record;;
                    * ) echo "Please answer yes or no.";;
                esac
        else
            echo "No noise sample found! Start recording one."
            record;
            while true; do
                read -p "Do you wish to re-record the noise sample?" yn
                case $yn in
                    [Yy]* ) record;;
                    [Nn]* ) break;;
                    * ) echo "Please answer yes or no.";;
                esac
            done
    fi



#create noise profile
echo "create noise profile"
sox $noiseFile -n noiseprof noise.prof

# change *usb to *pci if your microphone is connected to a pci card
input=`echo "$devices" | grep input.*usb`
output=`echo "$devices" | grep output.*aloop`
echo $input
echo $output
echo "Sending output to loopback device. Change recording port to &lt;Loopback Analog Stereo Monitor&gt; in PulseAudio to apply. Ctrl+C to terminate."

#filter audio from $input to $output
pacat -r -d $input --latency=1msec | sox -b 16 -e signed -c 2 -r 44100 -t raw - -b 16 -e signed -c 2 -r 44100 -t raw - noisered noise.prof 0.2 | pacat -p -d $output --latency=1msec

