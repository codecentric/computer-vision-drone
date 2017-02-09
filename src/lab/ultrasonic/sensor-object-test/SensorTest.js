/**
 * Created by tobias on 08.02.17.
 */

'use strict'

var Sensor = require('./Sensor');
var usonic = require('mmm-usonic');

var sensorFront = new Sensor(9, 10, "front");


usonic.init(function (error) {
    if (error) {
        //sensorFront.triggerStart(); // only for local test
        console.log("FEHLER :(");
        console.log(error);
    } else {
        console.log("created sensor");
        sensorFront.triggerStart();
    }
});


setTimeout(function() {
    /* this function will contain the drone steering */
    setInterval(function () {
        var curDis = sensorFront.getDistance();
        if (curDis < 30) {
            console.log("OH MY GOD! BREAK THE DRONE!! STOP IT! Distance: " + curDis);
        }

    }, 200);
}, 1000);







