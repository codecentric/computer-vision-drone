#!/bin/bash


counter=0;

while true;
do
    sudo node Beep.js;
    counter=$((counter+1));
    arecord -D "plughw:1,0" -d 15 "noise_$counter.wav";
done