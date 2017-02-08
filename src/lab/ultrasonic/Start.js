/**
 * Created by tobias on 08.02.17.
 */

var Drone = require('./Drone.js');
var usonic = require('mmm-usonic');


usonic.init(function (error) {

    if(error) {
        console.log(error);
    } else {
        //this.sensor = usonic.createSensor(this.gpioEcho, this.gpioTrigger, timeout, delay, rate);
        usonic.createSensor(9, 10, 750, 60, 5);
    }

});

console.log("Starting drone..");
var myDrone = new Drone();


myDrone.start();