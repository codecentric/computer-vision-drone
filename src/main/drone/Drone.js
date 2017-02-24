/**
 * @Author Tobias Schaber, codecentric AG
 *
 * Drone implementation
 */

/** set test mode to true to prevent the drone from really starting */

var usonic = require('mmm-usonic');
var Button = require('./sensors/Button');
var DistanceSensor = require('./sensors/DistanceSensor');
var Buzzer = require('./sensors/Buzzer');
var Bebop = require("node-bebop");
var ping = require ("net-ping");

module.exports = Drone;


/**
 * create a drone object. the constructor will set up all required sensors and components
 * @param flightDurationSec the duration in seconds the flight will last until landing
 * @param if true, the drone will be in test mode and not start the drone
 * @constructor
 */
function Drone(flightDurationSec, testMode) {

    this.minBatteryLevel = 10;
    this.flightControlId = -1;

    console.log("setting up cv-drone...");

    this.testMode = testMode;
    this.flightDurationSec = flightDurationSec;
    this.readyForTakeoff;           // is the drone ready for takeoff? [default = undefined]
    this.isFlying = false;          // is the drone currently flying?
    this.isConnected = false;       // is the pi connected to the drone?

    try {

        this.pingSession = ping.createSession();

        this.bebop = Bebop.createClient();

        /* connect to drone and pass a connected handler */
        this.bebop.connect(this.onConnect.bind(this));

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

        /* register some handlers for global errors */
        process.on('exit', this.onException.bind(this, "exit"));
        process.on('SIGINT', this.onException.bind(this, "SIGINT"));    // CTRL+C
        process.on('SIGTERM', this.onException.bind(this, "SIGTERM"));  // KILL
        process.on('uncaughtException', this.onException.bind(this));   // UNCAUGHT EXCEPTIONS

        /* ping drone once to check if connected */
        this.pingDrone();

        /* recurring ping for live connection check */
        setInterval(this.pingDrone.bind(this), 350);

        this.led.blink(5, 200);
        console.log("setting up cv-drone finished! ready for takeoff");


        /* if readyForTakeoff was set (from undef) to false while initialising, something is wrong,
           so do not set it to ready! */
        if(this.readyForTakeoff != false) this.readyForTakeoff = true;

    } catch(error) {
        this.readyForTakeoff = false;
        console.log("error setting up drone: " + error.message);
        this.onException();
    }
}


/**
 * setup method which checks that the drone is reachable via the network.
 * @param error
 */
Drone.prototype.pingDrone = function() {

    this.pingSession.pingHost(this.bebop.ip, this.reactOnPing.bind(this));

}


/**
 * reaction on a ping. the reaction depends on whether the ping failed or not.
 * if it failed and the drone is in flying state, it will beep and blink to warn
 * all people around.
 * @param error
 */
Drone.prototype.reactOnPing = function(error) {

    if(error) {
        this.isConnected = false;
        this.readyForTakeoff = false;

        if(this.isFlying == true) {
            this.buzzer.blink(1, 250);
            this.led.blink(1, 250);

            // try to reconnect to the drone?
            //this.bebop = Bebop.createClient();
            //this.bebop.connect(this.onConnect.bind(this));

        } else {
            throw "drone not reachable: ping failed. will exit because drone is not in flying state.";
        }
    }
    else {
        this.isConnected = true;
    }

}


/**
 * this method is called when the connection to the drone is established.
 * we can then add some state listeners.
 */
Drone.prototype.onConnect = function() {

    try {
        /* battery level check */
        this.bebop.on("battery", this.batteryCheck.bind(this));

    } catch(exception) {
        console.log(exception);
    }
}


/**
 * react on a battery event and perform a check if the battery level is OK.
 * otherwise, make the drone not ready-for-takeoff and land the drone.
 * @param batteryLevel
 */
Drone.prototype.batteryCheck = function(batteryLevel) {
    console.log("battery level: " + batteryLevel +  "%");
    if(batteryLevel < this.minBatteryLevel) {
        this.readyForTakeoff = false;
        this.landing("battery low");
    }
}


/**
 * event handler for the button. will start the drone after some warnings
 */
Drone.prototype.buttonPushed = function() {

    if(this.readyForTakeoff == true && this.isFlying == false) {

        /* enter takeoff mode to prevent multiple triggers */
        this.isFlying = true;

        console.log("received starting signal for takeoff.");

        this.led.blink(30, 100);
        this.buzzer.blink(3, 1000);

        setTimeout(this.takeoff.bind(this), 4000);
    } else {
        if(this.readyForTakeoff == false) {
            console.error("drone is not in ready-for-takeoff state");
        }

        if(this.isFlying == true) {
            console.error("drone is already flying. take your fingers out of the way!!");
        }
    }
}


/**
 * this method will let the drone takeoff
 */
Drone.prototype.takeoff = function() {

    /* start the flight control loop */
    this.flightControlId = setInterval(this.flightControl.bind(this), 100);


    /* automatically land the drone after some time */
    setTimeout(this.landing.bind(this, "flight time over"), (this.flightDurationSec*1000));

    console.log("============= TAKING OFF!!! Flight length will be : " + this.flightDurationSec + " sec.");

    if(this.testMode == false) {
        this.bebop.takeOff();
    } else {
        console.log("[[drone is in test mode so will not take off]]");
    }
}


/**
 * this method will let the drone land
 */
Drone.prototype.landing = function(message) {

    console.log("received landing event: " + message);

    if (this.isFlying == true) {

        /* stop the flight control loop */
        clearInterval(this.flightControlId);

        console.log("============= LANDING NOW!!!");

        this.buzzer.blink(3, 1000);
        this.led.blink(30, 100);

        if(this.testMode == false) {
            this.bebop.stop();
            this.bebop.land();
        } else {
            console.log("[[drone is in test mode so will not land}}");
        }

        this.isFlying = false;
    } else {
        console.log("the drone is not in [flying] state, so no need to land.");
    }
}


/**
 * central steering of the drone
 */
Drone.prototype.flightControl = function() {

    if(this.isConnected == true) {

        var dist = this.sensorFront.getDistance();

        //console.log("distances: " + dist);

        if (dist < 100) {
            this.landing("distance low");
        }
        console.log("flying");

    } else {

        console.log("disconnected...");

    }






}

/**
 * exception handler. will be called on every urgent exception.
 * will stop the drone with warnings end then exit.
 */
Drone.prototype.onException = function(err) {

    console.log("Exception handler called. " + err);

    try {
        this.led.blink(100, 100);
        this.buzzer.blink(5, 100);
    } catch(error) {
        console.error("error: can not broadcast exception by led or buzzer because of: " + error.message);
    }

    this.emergencyLand();
}


/**
 * perform an emergency landing of the drone at the place where it is standing
 *
 */
Drone.prototype.emergencyLand = function() {

    console.error("============= EMERGENCY LANDING NOW!");

    // stop drone etc.
    this.bebop.stop();
    this.bebop.land();
    this.isFlying = false;


    process.exit(1);
}

