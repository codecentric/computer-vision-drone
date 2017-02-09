/**
 * Created by tobias on 08.02.17.
 */



var SensorO = require('./SensorObj');
var usonic = require('mmm-usonic');

var sens = new SensorO(9, 10, "front");

var wert = -1;

/* this is only a logger function. it can be removed! */
setInterval(function () {
   wert = sens.getDistance();
}, 1000);



usonic.init(function (error) {
    if (error) {
        console.log("FEHLER :(");
        console.log(error);
    } else {
        console.log("created sensor");
        sensx = usonic.createSensor(10, 9, 750, 60, 5);
        change();
    }
});


/* this function will contain the drone steering */
setInterval(function () {
    if( wert < 30) {
        console.log("OH MY GOD! BREAK THE DRONE!! STOP IT!");
    }

}, 200);







