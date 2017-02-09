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
    internalSensor = usonic.createSensor(pinEcho, pinTrigger, 750, 60, 5);

    setInterval(this.refresh.bind(this), 500);

}

SensorObj.prototype.refresh = function() {
    this.distance = internalSensor();
    console.log(this.distance);
}

SensorObj.prototype.triggerStart = function() {
    console.log("triggered");
}


SensorObj.prototype.getDistance = function() {
    return this.distance;
}
