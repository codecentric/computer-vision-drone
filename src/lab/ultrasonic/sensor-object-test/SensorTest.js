/**
 * Created by tobias on 08.02.17.
 */

'use strict'

var SensorO = require('./SensorObj');
var usonic = require('mmm-usonic');

var sens = new SensorO(9, 10, "front");


usonic.init(function (error) {
    if (error) {
        //sens.triggerStart();
        console.log("FEHLER :(");
        console.log(error);
    } else {
        console.log("created sensor");
        sens.triggerStart();

    }
});


setTimeout(function() {
    /* this function will contain the drone steering */
    setInterval(function () {
        var curDis = sens.getDistance();
        if (curDis < 30) {
            console.log("OH MY GOD! BREAK THE DRONE!! STOP IT! Distance: " + curDis);
        }

    }, 200);
}, 1000);







