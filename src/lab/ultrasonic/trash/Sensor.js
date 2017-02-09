/**
 * Created by tobias on 06.02.17.
 */

var usonic     = require('mmm-usonic');
var statistics = require('math-statistics');

module.exports = Sensor;

function Sensor(gpioTrigger, gpioEcho, sensorName, timeout, delay, rate) {

    /* ===================================================================================== */

    this.gpioTrigger = gpioTrigger;
    this.gpioEcho = gpioEcho;
    this.timeout = timeout;
    this.sensorName = sensorName;
    this.delay = delay;
    this.rate = rate;
    this.distances = [];
    this.currentDistance = -1;
    usonic.createSensor(this.gpioEcho, this.gpioTrigger, this.timeout, this.delay, this.rate);
    console.log("initialized sensor [" + this.sensorName + "] on pins (T: " + this.gpioTrigger + ", E: " + this.gpioEcho +")");

}

Sensor.prototype.getDist = function() {
    return this.currentDistance;
}

Sensor.prototype.setDistance = function() {
    this.currentDistance = statistics.median(this.distances).toFixed(2);
}


Sensor.prototype.triggerMeasureCycle = function() {

    console.log(".");
    console.log(usonic.createSensor(this.gpioEcho, this.gpioTrigger, this.timeout, this.delay, this.rate));


    //if (!this.distances || this.distances.length === this.rate) {

      //  this.setDistance();

        //this.distances = [];
    //}

    //setTimeout(function () {
//        this.distances.push(this.sensor());
//        console.log(".");
//        this.triggerMeasureCycle();
//    }, this.delay);

}





