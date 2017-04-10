/**
 *
 * @Autor Tobias Schaber, codecentric AG
 *
 * This class represents a distance sensor of typ HC-SR04 on the drone.
 *
 * ATTENTION: Before creating a sensor object, call
 *   usonic.init(function (error) {...} (see the SensorTest.js as an example).
 *
 * Create a sensor object with the constructor. This will automatically initialize the hardware.
 * After that, call method "triggerStart()" to begin.
 *
 * In the background there will automatically be measurements performed in a configured interval.
 * The current distance of the sensor can be queried via the method "getDistance()".
 *
 * Please note that the results of getDistance() are filtered, so they can not exceed this.maxDistance.
 * There is also always an average returned of the last measurements, ignoring the biggest and lowest value.
 * So it might take some measurements to recognize extreme changes.
 *
 * If the quality of your measurements is very poor, try the following adjustments:
 *      1. increase the array length of this.distances (default is 5)
 *      2. reduce the value of this.refreshInterval (to compensate the bigger distance list)
 * This will lead to flatter results.
 *
 */

var usonic = require('mmm-usonic');

module.exports = DistanceSensor;


/**
 * Constructor for the sensor
 * @param pinTrigger the GPIO representation of the trigger pin of HC-SR04
 * @param pinEcho the GPIO representation of the echo pin of HC-SR04
 * @param name the name of the sensor (e.g. "front", "left", "down")
 * @param refreshInterval the interval in which a measurement will be performed
 * @constructor
 */
function DistanceSensor(pinTrigger, pinEcho, name, refreshInterval) {

    this.maxDistance = 320; // max distance in cm
    this.refreshInterval = refreshInterval;
    this.pinTrigger = pinTrigger;
    this.pinEcho = pinEcho;
    this.name = name;
    this.distances = [0, 0, 0 ,0 ,0, 0, 0]; // last X measurements
    this.internalSensor = usonic.createSensor(this.pinEcho, this.pinTrigger, 1000, true);
}


/**
 *  refresh the drone. will be called in an interval
 */
DistanceSensor.prototype.refresh = function() {
    /* get distance from sensor */
    var newMeasured = this.internalSensor();

    /* filter invalid values (-1 or > max distance) */
    if( newMeasured == -1 || newMeasured > this.maxDistance) {
        newMeasured = this.maxDistance;
    }

    /* add a new measurement and remove the oldest */
    this.distances.push(newMeasured);
    this.distances.shift();
};


/**
 * trigger the measurement background job with a given interval
 */
DistanceSensor.prototype.triggerStart = function() {
    console.log("sensor [" + this.name + " ] is beginning with scanning.");
    setInterval(this.refresh.bind(this), this.refreshInterval);
};


/**
 * take the list of past measurements, remove the max and min value, and build
 * an average, and round that to 2 digits
 */
DistanceSensor.prototype.getDistance = function() {

    var cleanDist = (((
            this.distances.reduce(
                function(a,b) { return a+b}
            )        )
        - Math.max.apply(Math, this.distances)  // remove biggest value
        - Math.min.apply(Math, this.distances)  // remove smallest value
    ) / (this.distances.length-2))              // build average
        .toFixed(2);                            // reduce number of decimal places

    return cleanDist;

};
