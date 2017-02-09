/**
 * Created by tobias on 09.02.17.
 */


var usonic = require('mmm-usonic');

module.exports = SensorObj;

function SensorObj(pinTrigger, pinEcho, name) {

    this.pinTrigger = pinTrigger;
    this.pinEcho = pinEcho;
    this.name = name;
    this.distance = 0;
    this.internalSensor = usonic.createSensor(pinEcho, pinTrigger, 750, 60, 5);
}

/* refresh the drone. will be called in an interval */
SensorObj.prototype.refresh = function() {
    this.distance = this.internalSensor();
    console.log(this.distance);
}

/* trigger the measurement background job */
SensorObj.prototype.triggerStart = function() {
    console.log("triggered");
    setInterval(this.refresh.bind(this), 500);
}


SensorObj.prototype.getDistance = function() {
    return this.distance;
}
