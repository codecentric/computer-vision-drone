#!/bin/bash
time=5
workDir='/tmp'
record()
{
    echo "Recording background noise. Keep quiet for $time seconds."
    sleep 3
    arecord -D 'plughw:1,0' -f cd noise.wav &
    PID=$!
    sleep $time
    kill $PID
    aplay noise.wav
}

#get pulse audio devices
devices=`pactl list | grep -E -A2 '(Source|Sink) #' | grep 'Name: ' | grep -v monitor | cut -d" " -f2`
if [ `echo "$devices" | grep -c aloop` -lt 1 ]; then
    echo "No loopback device created. Run 'sudo modprobe snd_aloop' first."
    exit
fi

cd $workDir

#record noise sample
record
while true; do
    read -p "Do you wish to re-record the noise sample?" yn
    case $yn in
        [Yy]* ) record;;
        [Nn]* ) break;;
        * ) echo "Please answer yes or no.";;
    esac
done

#create noise profile
sox noise.wav -n noiseprof noise.prof

input=`echo "$devices" | grep input.*usb`
output=`echo "$devices" | grep output.*aloop`

echo "Sending output to loopback device. Change recording port to &lt;Loopback Analog Stereo Monitor&gt; in PulseAudio to apply. Ctrl+C to terminate."

#filter audio from $input to $output
pacat -r -d $input --latency=1msec | sox -b 16 -e signed -c 2 -r 44100 -t raw - -b 16 -e signed -c 2 -r 44100 -t raw - noisered noise.prof 0.2 | pacat -p -d $output --latency=1msec

