/* This example enables streamed RTP video data from the drone
Run this example, then in a separate console, you can open a playback window
using mplayer (part of ffmpeg):
      mplayer examples/bebop.sdp
*/
"use strict";

var bebop = require("../../../../node-bebop/lib");

var drone = bebop.createClient({ip: "192.168.42.1"});

drone.connect(function() {
  drone.MediaStreaming.videoStreamMode(2);
  drone.PictureSettings.videoStabilizationMode(3);
  drone.MediaStreaming.videoEnable(1);
});

