/**
 * Created by tobias on 08.02.17.
 */

'use strict'

var DistanceSensor = require('../../../main/drone/sensors/DistanceSensor');
var Buzzer = require('../../../main/drone/sensors/Buzzer')
var usonic = require('mmm-usonic');

var sensorLeft  = new DistanceSensor(20, 16, "front", 200);
var sensorFront = new DistanceSensor(19, 26, "left", 200);
var sensorRight  = new DistanceSensor(23, 24, "right", 200);
var distanceWarner = new Buzzer(5, 'distanceWarner');


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
            distanceWarner.switch(Buzzer.ON)
        } else {
            distanceWarner.switch(Buzzer.OFF)
        }

    }, 300);
}, 1000);







