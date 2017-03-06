Some useful commands

`pulseaudio --start`


record from device 1,0

`arecord -D 'plughw:1,0' -f cd noise.wav`


list all recoding devices

`arecord -l` 

trim audio file 

```
 sox noise_2.wav noise_2_trim.wav --show-progress trim 00:00 00:08
```