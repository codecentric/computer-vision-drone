/**
 * @Author Tobias Schaber, codecentric AG
 *
 * Drone implementation
 */

var Button = require('./sensors/Button')
var DistanceSensor = require('./sensors/DistanceSensor');
var Buzzer = require('./sensors/Buzzer')

module.exports = Drone;


/**
 * create a drone object
 * @constructor
 */
function Drone() {

    console.log("setting up cv-drone...");

    this.startButton = new Button(23, "startButton", this.buttonPushed.bind(this));
    this.buzzer = new Buzzer(19, "buzzer");
    this.led = new Buzzer(26, "led");

    this.buzzer.onOff(200);
    this.led.blink(5, 500);

    this.sensorLeft  = new DistanceSensor(17, 5, "left", 200);
    this.sensorFront = new DistanceSensor(27, 6, "front", 200);
    this.sensorRight  = new DistanceSensor(22, 13, "right", 200);

    this.sensorFront.triggerStart();
    this.sensorLeft.triggerStart();
    this.sensorRight.triggerStart();

    console.log("setting up cv-drone finished! ready for takeoff");
}



Drone.prototype.buttonPushed = function() {
    console.log("pushed button");
}


/**
 * perform an emergency landing of the drone at the place where it is standing
 *
 */
Drone.prototype.emergencyLand = function() {
    //TODO: TO BE IMPLEMENTED
}

