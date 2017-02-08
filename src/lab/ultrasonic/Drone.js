

var Sensor = require('./Sensor.js');
var usonic = require('mmm-usonic');

module.exports = Drone;

/* sensors mounted on the drone */
var sensorFront;
var sensorLeft;
var sensorRight;
var sensorBack;


function Drone() {

    console.log("Creating a drone");

    usonic.init(function (error) {

        if(error) {
            console.log(error);
        } else {
            //this.sensor = usonic.createSensor(this.gpioEcho, this.gpioTrigger, timeout, delay, rate);
            usonic.createSensor(9, 10, 750, 60, 5);
        }

    });

    this.sensorFront = new Sensor(9, 10, "front");
    //this.sensorLeft  = new Sensor(22, 27, "left");
    //this.sensorRight = new Sensor(23, 24, "right");
    //this.sensorBack  = new Sensor(17, 18, "back");

    this.start = function () {

        console.log("starting the drone autopilot");



        while(true) {
            console.log("distances: " + this.sensorFront.getDistance());
        }
    }
}




