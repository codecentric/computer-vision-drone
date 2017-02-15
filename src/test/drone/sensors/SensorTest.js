/**
 * Created by tobias on 08.02.17.
 */

'use strict'

var DistanceSensor = require('../../../main/drone/sensors/DistanceSensor');
var usonic = require('mmm-usonic');

var sensorLeft  = new DistanceSensor(17, 5, "front", 200);
var sensorFront = new DistanceSensor(27, 6, "left", 200);
var sensorRight  = new DistanceSensor(22, 13, "right", 200);



usonic.init(function (error) {
    if (error) {
        //sensorFront.triggerStart(); // only for local test
        console.log("FEHLER :(");
        console.log(error);
    } else {
        console.log("created sensor");
        sensorFront.triggerStart();
        sensorLeft.triggerStart();
        sensorRight.triggerStart();
    }
});


setTimeout(function() {
    /* this function will contain the drone steering */
    setInterval(function () {
        var curDis = sensorFront.getDistance();
        console.log("front: " + sensorFront.getDistance());
        console.log("left: " + sensorLeft.getDistance());
        console.log("right: " + sensorRight.getDistance());
        console.log("------------------------------------");

        if (curDis < 30) {
            console.log("OH MY GOD! BREAK THE DRONE!! STOP IT! Distance: " + curDis);

        } else {

        }

    }, 300);
}, 1000);







