/**
 * Created by tobias on 09.02.17.
 */


/* TODO: mengenmessung / filter zum filtern von ausreisern (z.B. > 10m)
    -1 rausfiltern
    genauigkeit. ab einer bestimmten distanz kommen krumme sachen raus.

 */

var statistics = require('math-statistics');
var usonic = require('mmm-usonic');

module.exports = Sensor;

function Sensor(pinTrigger, pinEcho, name) {

    this.pinTrigger = pinTrigger;
    this.pinEcho = pinEcho;
    this.name = name;
    this.distance = 0;
    this.internalSensor = usonic.createSensor(this.pinEcho, this.pinTrigger, 750);
}

/* refresh the drone. will be called in an interval */
Sensor.prototype.refresh = function() {
    this.distance = this.internalSensor();
}

/* trigger the measurement background job */
Sensor.prototype.triggerStart = function() {
    console.log("sensor [" + this.name + " ] is beginning with scanning.");
    setInterval(this.refresh.bind(this), 500);
}


Sensor.prototype.getDistance = function() {

    return this.distance.toFixed(2);
}
