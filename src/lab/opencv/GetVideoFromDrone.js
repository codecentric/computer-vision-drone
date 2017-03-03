"use strict";

//
// This example requires the haarcascade file located at
// https://github.com/peterbraden/node-opencv/raw/master/data/haarcascade_frontalface_alt.xml
//

var bebop = require("node-bebop"),
    cv = require("opencv"),
    async = require("async");

var drone = bebop.createClient(),
    w = new cv.NamedWindow("Video", 0),
    buf = null;

drone.connect(function() {
    drone.MediaStreaming.videoEnable(1);
    drone.MediaStreaming.videoStreamMode(0);
    console.log("connected to drone")
});

drone.on("battery", function(batteryLevel) {
    console.log("Battery Level: " + batteryLevel)
    drone.MediaStreaming.videoEnable(1);
});

async.forever(
    function(callback) {
        if (buf == null) {
            return callback();
        }

        cv.readImage(buf, function(err, im) {
            if (err) {
                console.log(err);
                callback();
            } else {
                /*
                im.detectObject(cv.FACE_CASCADE, {}, function(e, faces) {
                    if (e) {
                        console.log(err);
                    }

                    for (var i = 0; i < faces.length; i++) {
                        var face = faces[i];
                        im.rectangle([face.x, face.y],
                            [face.width, face.height], [0, 255, 0], 2);
                    }

                 w.show(im);
                 w.blockingWaitKey(0, 50);

                    setTimeout(function() {
                        callback();
                    }, 100);
                });
                */
                w.show(im);
                w.blockingWaitKey(0, 50);
            }
        });
    }
);