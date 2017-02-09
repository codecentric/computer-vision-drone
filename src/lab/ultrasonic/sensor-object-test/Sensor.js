/**
 * Created by tobias on 09.02.17.
 */

var statistics = require('math-statistics');
var usonic = require('mmm-usonic');

module.exports = Sensor;

function Sensor(pinTrigger, pinEcho, name, refreshInterval) {

    this.maxDistance = 320; // max distance in cm
    this.refreshInterval = refreshInterval;
    this.pinTrigger = pinTrigger;
    this.pinEcho = pinEcho;
    this.name = name;
    this.distances = [0, 0, 0 ,0 ,0]; // last X measurements
    this.internalSensor = usonic.createSensor(this.pinEcho, this.pinTrigger, 750, true);
}

/* refresh the drone. will be called in an interval */
Sensor.prototype.refresh = function() {
    /* get distance from sensor */
    var newMeasured = this.internalSensor();

    /* filter invalid values (-1 or > max distance */
    if( newMeasured == -1 || newMeasured > this.maxDistance) {
        newMeasured = this.maxDistance;
    }

    /* add a new measurement and remove the oldest */
    this.distances.push(newMeasured);
    this.distances.shift();
}

/* trigger the measurement background job with a given interval */
Sensor.prototype.triggerStart = function() {
    console.log("sensor [" + this.name + " ] is beginning with scanning.");
    setInterval(this.refresh.bind(this), this.refreshInterval);
}


/* take the list of past measurements, remove the max and min value, and build
 * an average, and round that to 2 digits
 */
Sensor.prototype.getDistance = function() {

    var cleanDist = (((
            this.distances.reduce(
                function(a,b) { return a+b}
            )        )
        - Math.max.apply(Math, this.distances)  // remove biggest value
        - Math.min.apply(Math, this.distances)  // remove smallest value
    ) / (this.distances.length-2))              // build average
        .toFixed(2);                            // reduce number of decimal places

    return cleanDist;

}
