/**
 * @Author Tobias Schaber, codecentric AG
 *
 * Drone implementation
 */

var usonic = require('mmm-usonic');
var Button = require('./sensors/Button')
var DistanceSensor = require('./sensors/DistanceSensor');
var Buzzer = require('./sensors/Buzzer')

module.exports = Drone;


/**
 * create a drone object. the constructor will set up all required sensors and components
 * @constructor
 */
function Drone() {

    console.log("setting up cv-drone...");

    try {
        this.led = new Buzzer(26, "led");
        this.led.switch(Buzzer.ON);

        this.startButton = new Button(23, "startButton", this.buttonPushed.bind(this));

        this.buzzer = new Buzzer(19, "buzzer");
        this.buzzer.onOff(100);

        this.sensorLeft = new DistanceSensor(17, 5, "left", 200);
        this.sensorFront = new DistanceSensor(27, 6, "front", 200);
        this.sensorRight = new DistanceSensor(22, 13, "right", 200);

        usonic.init(function (error) {
            if (error) {
                console.log("error setting up ultrasonic sensor module: " + error.message);
                this.onException();
            } else {

            }
        });

        this.sensorFront.triggerStart();
        this.sensorLeft.triggerStart();
        this.sensorRight.triggerStart();

        this.led.blink(5, 200);
        console.log("setting up cv-drone finished! ready for takeoff");

    } catch(error) {
        console.log("error setting up drone: " + error.message);
        this.onException();
    }
}


/**
 * event handler for the button
 */
Drone.prototype.buttonPushed = function() {
    console.log("received starting signal for takeoff.");

    this.led.blink(3, 1000);
    this.buzzer.blink(3, 1000);

    setTimeout(this.takeoff.bind(this), 4000);
}


/**
 * this method will tell the drone to takeoff after some warnings
 */
Drone.prototype.takeoff = function() {

    console.log("TAKING OFF!!!");
    //TODO: to be implemented



}


/**
 * exception handler. will be called on every urgent exception.
 * will stop the drone with warnings end then exit.
 */
Drone.prototype.onException = function() {

    console.log("EXCEPTION HANDLER STARTING!");

    try {
        this.led.blink(100, 100);
        this.buzzer.blink(5, 100);
    } catch(error) {
        console.log("error: can not broadcast exception by led or buzzer because of: " + error.message);
    }

    this.emergencyLand();
}


/**
 * perform an emergency landing of the drone at the place where it is standing
 *
 */
Drone.prototype.emergencyLand = function() {

    //TODO: TO BE IMPLEMENTED
    // stop drone etc.

    process.exit(1);
}

