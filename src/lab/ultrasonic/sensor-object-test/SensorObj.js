/**
 * Created by tobias on 09.02.17.
 */


var usonic = require('mmm-usonic');


module.exports = SensorObj;

function SensorObj(pinTrigger, pinEcho, name) {

    this.pinTrigger = pinTrigger;
    this.pinEcho = pinEcho;
    this.name = name;
    this.distance = -1;
    this.sens = usonic.createSensor(pinEcho, pinTrigger, 750, 60, 5);


}



SensorObj.prototype.updateValue = function() {
    console.log("updating");

    this.distance = this.sens();

    setTimeout(SensorObj.prototype.updateValue, 500);

}

SensorObj.prototype.getDistance= function() {
    return this.distance;
}
