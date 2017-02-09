/**
 * Created by tobias on 09.02.17.
 */


var usonic = require('mmm-usonic');

module.exports = SensorObj;

function SensorObj(pinTrigger, pinEcho, name) {
    self = this
    this.pinTrigger = pinTrigger;
    this.pinEcho = pinEcho;
    this.name = name;
    this.distance = -1;
    internalSensor = usonic.createSensor(pinEcho, pinTrigger, 750, 60, 5);

    setInterval(function () {
        this.distance = internalSensor();
        console.log(this.distance);
    }, 500);

}

SensorObj.prototype.triggerStart = function() {
    console.log("triggered");
    /* this is only a logger function. it can be removed! */


}

SensorObj.prototype

SensorObj.prototype.getDistance= function() {
    return this.distance;
}
