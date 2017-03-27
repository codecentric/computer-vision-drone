#!/bin/bash


counter=10;

while true;
do
    sudo node Beep.js;

    arecord -D "plughw:1,0" -f cd "cs_$counter.wav" &
    PID=$!
    sleep 60
    kill $PID

#    arecord -D "plughw:2,0" -f cd "2_0_noise_$counter.wav" &
#    PID1=$!
#    sleep 10
#    kill $PID1
#
#    arecord -D "plughw:2,1" -f cd "2_1_noise_$counter.wav" &
#    PID2=$!
#    sleep 10
#    kill $PID2
    counter=$((counter+1));
    exit
done
sudo node Beep.js;