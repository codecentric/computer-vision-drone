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
var Voice = require('./voice/Voice');
var events = require('events');
var WebSocketServer = require('ws').Server;

var WatchJS = require("melanke-watchjs")
var watch = WatchJS.watch;
var unwatch = WatchJS.unwatch;
var callWatchers = WatchJS.callWatchers;


const readline = require('readline');
const eventEmitter = new events.EventEmitter();
const globalDebugLevel = 1;


readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

module.exports = Drone;


/**
 * create a drone object. the constructor will set up all required sensors and components
 * @param flightDurationSec the duration in seconds the flight will last until landing
 * @param testMode if true, the drone will be in test mode and not start the drone
 * @constructor
 */
function Drone(flightDurationSec, testMode) {

    this.log("setting up cv-drone...");

    this.bebopOpts = {};
    this.state = {};
    this.config = {};
    /** public configuration ================================================================================= */

    /* IP address of the drone.
       WLAN: 192.168.42.1, USB is 192.168.43.1 */
    this.bebopOpts.ip = '192.168.42.1';

    /* minimal battery level before landing */
    this.config.minBatteryLevel = 5;

    /* refresh interval of the distance sensors */
    this.config.sensorRefreshIntervall = 40;

    /* refresh interval of the flight control mechanism */
    this.config.flightControlInterval = 100;

    /* hotWord file for voice commands */
    this.config.hotWordFile = "voice/resources/snowboy.umdl"


    /** internal configuration =============================================================================== */

    /* internel event emitter for sending messages to the websocket */

    /* internal interval-id of the flight loop */
    this.flightControlId = -1;

    /* internal timeout-id of remaining time landing */
    this.timeOverId = -1;

    /* internal timeout id of triggering the flight control */
    this.triggerFlightControlId = -1;

    this.config.testMode = testMode;
    this.config.flightDurationSec = flightDurationSec;

    this.state.batteryLevel = 0;


    /** flying states ======================================================================================== */

    /* drone movement and speeds */
    this.speed = {};
    this.speed.forward  = 0;            // current forward speed of the drone
    this.speed.turning  = 0;            // current turning speed of the drone ( > 0 = clockwise)
    this.speed.turningDirection = 0;    // -1 =
    this.speed.strafing = 0;            // current strafing speed of the drone ( > 0 = right direction)
    this.speed.maxForward = 15;         // maximum forward speed
    this.speed.maxTurning = 40;         // turning speed if turning is active
    this.speed.maxStrafing = 0;         // maximum strafing speed
    this.speed.accVectorForward = 3;    // difference of speed when performing one acceleration step forwards
    this.speed.accVectorBackward = 5;   // difference of speed when breaking the drone one step
    this.speed.accVectorStrafing = 0;   // difference of speed when accelerating into strafing direction
    this.state.movementLocked = false;        // checks if further movement orders are accepted

    /* is the drone ready for takeoff?
     setting to "false" in the constructor will prevent the drone from starting up */
    this.state.readyForTakeoff = undefined;   // setting to false in constructor will prevent from
    this.state.isFlying = false;              // is the drone currently flying?
    this.state.isWLANConnected = false;       // is the pi connected to WLAN of the drone?
    this.state.isDroneConnected = false;      // is the connection to the drone stable?
    this.state.isReconnecting = false;        // is the drone currently reconnecting?

    if(this.state.testMode == true) {
        this.log("==================== T E S T M O D E =============");
    }

    try {
        this.addWebsocketServer();
        this.addHttpServer();
        this.pingSession = ping.createSession();


        this.bebop = Bebop.createClient(this.bebopOpts);

        /* connect to drone and pass a connected handler */
        this.bebop.connect(this.onConnect.bind(this));

        this.led = new Buzzer(26, "led");
        this.led.switch(Buzzer.ON);

        this.startButton = new Button(23, "startButton", this.buttonPushed.bind(this));

        this.voice = new Voice("voice/resources/common.res");
        this.voice.addHotWord(this.config.hotWordFile, "droneTakeOff", 0.4);
        //this.voice.registerHotwordReaction(console.log("SNOWBOY"));
        this.voice.registerHotwordReaction(this.buttonPushed.bind(this));
        this.voice.triggerStart();

        this.buzzer = new Buzzer(19, "buzzer");
        this.buzzer.onOff(100);

        this.state.sensorRight = new DistanceSensor(17, 5, "right", this.config.sensorRefreshIntervall);
        this.state.sensorFront = new DistanceSensor(27, 6, "front", this.config.sensorRefreshIntervall);
        this.state.sensorLeft = new DistanceSensor(22, 13, "left", this.config.sensorRefreshIntervall);

        this.state.distFront;
        this.state.distLeft;
        this.state.distRight;


        usonic.init(function (error) {
            if (error) {
                this.log("error setting up ultrasonic sensor module: " + error.message);
                this.onException();
            } else {

            }
        });

        this.state.sensorFront.triggerStart();
        this.state.sensorLeft.triggerStart();
        this.state.sensorRight.triggerStart();

        // add watcher for trigger events on change of attributes
        watch(this.state, function (prop, action, newvalue, oldvalue) {
            /* log to event emitter for web UI */
            eventEmitter.emit("webHUD", JSON.stringify({'key' : prop, 'value' : newvalue}));
            //console.log("webHUD", JSON.stringify({'key' : prop, 'value' : newvalue}));
        });
        watch(this.speed, function (prop, action, newvalue, oldvalue) {
            /* log to event emitter for web UI */
            eventEmitter.emit("webHUD", JSON.stringify({'key' : prop, 'value' : newvalue}));
        });

        /* register some handlers for global errors */
        process.on('exit', this.onExit.bind(this, "exit"));
        process.on('SIGINT', this.onExit.bind(this, "SIGINT"));    // CTRL+C
        process.on('SIGTERM', this.onExit.bind(this, "SIGTERM"));  // KILL
        process.on('uncaughtException', this.onException.bind(this));   // UNCAUGHT EXCEPTIONS
        process.stdin.on('keypress', this.initKeyHandler.bind(this));

        /* ping drone once to check if connected */
        this.pingDrone();

        /* recurring ping for live connection check */
        setInterval(this.pingDrone.bind(this), 350);

        this.led.blink(5, 200);
        this.log("setting up cv-drone finished! ready for takeoff.");
        this.log("====================================================");
        this.log("Press [T]akeoff, or [Return] for emergency landing!");
        this.log("====================================================");

    } catch(error) {
        this.state.readyForTakeoff = false;
        this.log("error setting up drone: " + error.message);
        this.onException();
    }
}


/**
 * init some keyboard handlers for special keys like emergency controlling
 */
Drone.prototype.initKeyHandler = function(ch, key) {


    if (key.ctrl && key.name === 'c') {
        console.log("EXIT EVENT");
        this.onExit("STRG+C");
    } else {
        switch (key.name) {
            case 'return':
                this.log("ENTER");
                this.emergencyLand();
            break;

            case 't':
                this.buttonPushed();

                break;

            case 'left':

                break;
            case 'right':

                break;

            default:
        }
    }
}


/**
 * logs a message and sends it to different listeners like console or web UI
 * @param message the message to log
 * @param key (optional). if not provided, "log" will be assumed
 * @param value (optional). useful for the WebHUD if not provided, "null" will be assumed
 * @param debugLevel (optional). Control how much infos are displayed in the LOG. 0 shows all messages. An increasing Number shows less messages.
 *
 */
Drone.prototype.log = function(message, key, value, debugLevel) {

    /* assume "log" as key if not provided */
    key = key || "log";
    /* assume "NULL" as value if not provided */
    value = value || null;
    /* assume "1" as debugLevel if not provided */
    value = value || 1;

    /* assume global Loglevel if not set */
    debugLevel = debugLevel || globalDebugLevel ;
    var message = {'key' : key, 'message' : message, 'value' : value, 'debugLevel' : debugLevel};

    /* log "log" keys to stdout */
    //if(key == "log") {
        console.log(message.message);
    //}


    /* log to event emitter for web UI */
    eventEmitter.emit("webHUD", JSON.stringify(message));
}


/**
 * Add a websocketserver which sent messages to the client
 */
Drone.prototype.addWebsocketServer = function () {

    var wss = new WebSocketServer({host: '0.0.0.0',port: 8000});

    wss.on('connection', function(ws) {
        console.log("websocket server ready");
        eventEmitter.on('webHUD', function(message) {
            try {
                ws.send(message);
            }catch(err) {
                if (err != 'Error: not opened') {
                    console.log('Websocket error: %s', err);
                }
            }
        });

    });
};
/**
 * Add a static http server which sent messages to the client
 */
Drone.prototype.addHttpServer = function () {

    var fs = require('fs');
    var path = require('path');
    var http = require('http');

    var staticBasePath = './http/static';

    var staticServe = function(req, res) {
        var fileLoc = path.resolve(staticBasePath);
        fileLoc = path.join(fileLoc, req.url);

        fs.readFile(fileLoc, function(err, data) {
            if (err) {
                res.writeHead(404, 'Not Found');
                res.write('404: File Not Found!');
                return res.end();
            }

            res.statusCode = 200;

            res.write(data);
            return res.end();
        });
    };

    var httpServer = http.createServer(staticServe);

    httpServer.listen(8080);
};


/**
 * setup method which checks that the drone is reachable via the network.
 */
Drone.prototype.pingDrone = function() {
    this.pingSession.pingHost(this.bebop.ip, this.reactOnPing.bind(this));
};


/**
 * reaction on a ping. the reaction depends on whether the ping failed or not.
 * if it failed and the drone is in flying state, it will beep and blink to warn
 * all people around.
 * @param error
 */
Drone.prototype.reactOnPing = function(error) {

    if(error) {
        this.state.isWLANConnected = false;
        this.log('wlan not connected');
        this.state.isDroneConnected = false;
        this.log('drone not connected');
        this.state.readyForTakeoff = false;
        this.log('Not ready for Takeoff');

        if(this.state.isFlying == true) {
            this.log('WARNING Ping failed but Object is in flying Mode', 'connectionLost', true);
            /* warn blinking */
            this.buzzer.blink(1, 250);
            this.led.blink(1, 250);
        } else {
            this.log("drone not reachable: ping failed.");
        }
    } else {
        this.state.isWLANConnected = true;
        //this.log("wlan connected");
    }


};


/**
 * this method is called when the connection to the drone is established.
 * we can then add some state listeners.
 */
Drone.prototype.onConnect = function() {

    this.log("================================ CONNECTED TO DRONE");

    try {
        /* enables video streaming */
        this.bebop.MediaStreaming.videoStreamMode(2);
        this.bebop.PictureSettings.videoStabilizationMode(3);
        this.bebop.MediaStreaming.videoEnable(1);

        //this.bebop.PilotingSettings.maxAltitude(2);
        //this.bebop.PilotingSettings.minAltitude(2);
        /* battery level check */
        this.bebop.on("battery", this.batteryCheck.bind(this));
        this.bebop.on("ready", this.onDroneReady.bind(this));


        // TODO ONLY FOR TESTING. REMOVE!
        this.bebop.on("hovering", function() {
            //console.log("hovering");
        });

        // TODO ONLY FOR TESTING. REMOVE!
        this.bebop.on("flying", function() {
            //console.log("flying");
        });


        /* perform landing for emergencies */
        this.bebop.land(this.cleanUpAfterLanding.bind(this));

        if(this.state.isReconnecting == true) {
            this.log("RECONNECTED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            this.state.isReconnecting = false;
        }

    } catch(exception) {
        this.log(exception);
    }
};


/**
 * function will be executed as soon as there is the [ready] event arriving from the drone.
 */
Drone.prototype.onDroneReady = function() {

    this.state.isDroneConnected = true;
    this.log("received [\"ready\"] event from drone.", 'isDroneConnected', this.state.isDroneConnected);

    /* if readyForTakeoff was set (from undef) to false while initialising, something is wrong,
     so do not set it to ready! */
    if(this.state.readyForTakeoff != false) {
        this.state.readyForTakeoff = true;
        this.log('Ready for Takeoff set', 'readyForTakeoff', this.state.readyForTakeoff);
    } else {
        this.log('Something ist wrong with the Takeoff state. It is: ' + this.state.readyForTakeoff, 'readyForTakeoff', this.state.readyForTakeoff );
    }


};

/**
 * react on a battery event and perform a check if the battery level is OK.
 * otherwise, make the drone not ready-for-takeoff and land the drone.
 * @param batteryLevel
 */
Drone.prototype.batteryCheck = function(batteryLevel) {
    this.state.batteryLevel = batteryLevel;
    this.log("\rbattery level: " + batteryLevel +  "%", 'batteryLevel', this.state.batteryLevel);

    if(batteryLevel < this.config.minBatteryLevel) {
        this.state.readyForTakeoff = false;
        this.log('readyForTakeoff changed to false due to battery low', 'readyForTakeoff', this.state.readyForTakeoff, 0);
        this.landing("battery low");
    }
};



/**
 * event handler for the button. will start the drone after some warnings
 */
Drone.prototype.buttonPushed = function() {

    if(this.state.readyForTakeoff == true && this.state.isFlying == false) {

        /* enter takeoff mode to prevent multiple triggers */
        this.state.isFlying = true;
        //this.log('changed flying state to: ' + this.state.isFlying, 'isFlying', this.state.isFlying, 0);

        this.log("received starting signal for takeoff.");

        this.led.blink(30, 100);
        this.buzzer.blink(3, 1000);

        setTimeout(this.takeoff.bind(this), 3500);
    } else {
        if(this.state.readyForTakeoff == false) {
            this.log("drone is not in ready-for-takeoff state");
        }

        if(this.state.isFlying == true) {
            this.log("drone is already flying. take your fingers out of the way!!");
        }
    }
};


/**
 * this method will let the drone takeoff
 */
Drone.prototype.takeoff = function() {

    this.triggerFlightControlId = setTimeout(this.triggerFlightControl.bind(this), 5000);


    /* automatically land the drone after some time */
    this.timeOverId = setTimeout(this.landing.bind(this, "flight time over"), (this.config.flightDurationSec*1000));


    if(this.testMode == false) {
        this.bebop.takeOff();
        this.log("============= TAKING OFF!!! Flight length will be : " + this.config.flightDurationSec + " sec.", 'takeOff', this.config.flightDurationSec);
    } else {
        this.log("[[drone is in test mode so will not take off]]", 'takeOff', 0);
    }
};


Drone.prototype.triggerFlightControl = function() {

    /* start the flight control loop */
    this.flightControlId = setInterval(this.flightControl.bind(this), this.config.flightControlInterval);
}

/**
 * this method will let the drone land
 */
Drone.prototype.landing = function(message) {

    this.log("received landing event: " + message, 'landing');

    if (this.state.isFlying == true) {

        this.cleanUpAfterLanding();

        this.log("============= LANDING NOW!!!");

        this.buzzer.blink(3, 1000);
        this.led.blink(30, 100);

        if(this.testMode == false) {
            this.bebop.stop();
            this.bebop.land(this.cleanUpAfterLanding.bind(this));
        } else {
            this.log("[[drone is in test mode so will not land}}", 'landing');
        }

        this.state.isFlying = false;
        this.log('changed flying state to: ' + this.state.isFlying, 'isFlying', this.state.isFlying, 0);
    } else {
        this.log("the drone is not in [flying] state. will nevertheless land.", 'landing');
        this.bebop.stop();
        this.bebop.land(this.cleanUpAfterLanding.bind(this));
    }
};


/**
 * ===========================================================================================================
 * central steering of the drone
 * ===========================================================================================================
 *
 * this is the central steering logic of the drone.
 * it will be called in a configurable interval (this.config.flightControlInterval).
 */
Drone.prototype.flightControl = function() {

    if(this.state.isDroneConnected == true) {

        var distFront = this.state.sensorFront.getDistance();
        var distLeft  = this.state.sensorLeft.getDistance();
        var distRight = this.state.sensorRight.getDistance();
        this.state.distFront = distFront;
        this.state.distLeft = distLeft;
        this.state.distRight = distRight;

        this.showHUD(distFront, distLeft, distRight, this.speed.turning, this.speed.turningDirection);

        if(distFront < 80 || distLeft < 70|| distRight < 70) {

            this.log("F " + distFront);
            this.log("R " + distRight);
            this.log("L " + distLeft);
            this.landing("came to close to anything (F: " + distFront + " R: " + distRight + " L: " + distLeft);
        }

        var stopDistance = 120;

        //TODO add "rotatingPuffer" um nach einem Stop länger nachzudrehen?

        /* one of the distances is lower then stop-distance, slow down the drone and start rotating */
        if(distFront < stopDistance || distLeft < stopDistance || distRight < stopDistance) {
            this.slowDown();

            if((distLeft <= stopDistance) || distFront <= stopDistance) {
                //setTimeout(this.startRotate.bind(this, 1), 100);
                this.startRotate(1);
            }

            if(distRight <= stopDistance && distLeft >= stopDistance) {
                //setTimeout(this.startRotate.bind(this, -1), 100);
                this.startRotate(-1);
            }

        } else {

            /* upfront free */
            this.stopRotate();
            //setTimeout(this.accelerate.bind(this), 500);
            this.accelerate();
        }


    } else {

        if(this.state.isWLANConnected == false) {
            this.log("WLAN NOT CONNECTED");
        } else {

            /* WLAN connected but drone disconnected */
            if(this.state.isDroneConnected == false) {

                /* execute only once per reconnection try */
                if (this.state.isReconnecting == false) {
                    this.state.isReconnecting = true;

                    try {
                        //TODO: TRY TO REMOVE OLD CALLBACK

                        this.log("Adding a new connection listener and waiting for connection.");

                        /* add a new connect handler as the old seems no longer working */
                        this.bebop.connect(this.onConnect.bind(this));
                    } catch (error) {
                        this.log(error);
                    }
                }
            }
        }
    }
};

/**
 * Lock the drone so no further movement commands will be executed
 * @param duration time in ms for the lock
 */
Drone.prototype.lockMovement = function (duration) {
       this.state.movementLocked =  true;
       this.log('movements locked', 'movementLocked', this.state.movementLocked, 0);
       setTimeout(this.unlockMovement.bind(this), duration);
}

/**
 * unlock the Drone so it can move again
 */
Drone.prototype.unlockMovement = function () {
    this.state.movementLocked = false;
    this.log('movements unlocked', 'movementLocked', this.state.movementLocked, 0);
}

/**
 * stop the drone rotating if it is currently turning
 */
Drone.prototype.stopRotate = function() {

    if(this.speed.turning != 0 && !this.state.movementLocked) {
        this.bebop.clockwise(0);
        this.bebop.stop();
        this.speed.turning = 0;
        this.log('turning speed set to: ' + this.speed.turning, 'speedChanged', this.speed, 0)
    }
}


/**
 * print a HUD of the current flight state with basic information like sensor distances, rotating state etc.
 */
Drone.prototype.showHUD = function(distFront, distLeft, distRight, speedRotate, turningDirection) {

    // ↺ ↻
    var rotateIndicator = " ";

    if(speedRotate != 0 && turningDirection == 1) {
        rotateIndicator = "↻";
    } else {
        if(speedRotate < 0 && turningDirection == -1) {
            rotateIndicator = "↺";
        }
    }

    var speedDisplay = "=";
    for(i=0; i<this.speed.forward; i++) {
        speedDisplay = speedDisplay + "=";
    }
    process.stdout.write("\rBAT: " + this.state.batteryLevel + " | F: " + distFront + " | L: " + distLeft + " | R: " + distRight + " | " + rotateIndicator + " | speed: " + speedDisplay);
    //process.stdout.write("\nF: " + distFront + " | L: " + distLeft + " | R: " + distRight + " | " + rotateIndicator + " | speed: " + speedDisplay);
    //this.log('Distance Front: ' + distFront, 'distFront', distFront, 0);
    //this.log('Distance Left: ' + distLeft, 'distLeft', distLeft, 0);
    //this.log('Distance Right: ' + distRight, 'distRight', distRight, 0);
}



/**
 * start the drone rotation if not yet turning
 * @param direction 1 = clockwise, -1 = counterclockwise
 */
Drone.prototype.startRotate = function(direction) {

    this.speed.turningDirection = direction;
    //this.log('Turning Direction changed: ' + direction, 'turningDirection', direction, 0);

    if(this.speed.turning == 0 && !this.state.movementLocked) {
        this.bebop.stop();
        this.speed.turning = this.speed.maxTurning;
        //this.log('turning speed set to: ' + this.speed.turning, 'turningSpeed', this.speed.turning, 0)

        if(direction == 1) {
            this.bebop.clockwise(this.speed.turning);
        } else {
            this.bebop.counterClockwise(this.speed.turning);
        }
    }
}


/**
 * accelerate the drone up to a configured maximum speed
 */
Drone.prototype.accelerate = function() {

    if(this.speed.forward < this.speed.maxForward && !this.state.movementLocked) {
        this.bebop.stop();
        this.speed.forward = this.speed.maxForward;
        //this.log('forward speed set to: ' + this.speed.forward, 'forwardSpeed', this.speed.forward, 0)
        this.bebop.forward(this.speed.forward);
    }
}


/**
 * break the drone
 */
Drone.prototype.slowDown = function() {

    if(this.speed.forward != 0 && !this.state.movementLocked) {
        this.lockMovement(1000);
        this.speed.forward = 0;
        //this.log('forward speed set to: ' + this.speed.turning, 'forwardSpeed', this.speed.forward, 0)
        this.bebop.stop();
        this.buzzer.blink(1, 500);
    }
}


/**
 * exception handler. will be called on every urgent exception.
 * will stop the drone with warnings end then exit.
 */
Drone.prototype.onException = function(err) {

    this.log("Exception handler called. " + err);

    try {
        this.led.blink(100, 100);
        this.buzzer.blink(5, 100);
    } catch(error) {
        this.log("error: can not broadcast exception by led or buzzer because of: " + error.message);
    }

    this.emergencyLand();
};


/**
 * will clean up all handlers etc. after landing
 */
Drone.prototype.cleanUpAfterLanding = function() {

    this.log("cleaning up after landing");

    /* stop the flight control loop */
    clearInterval(this.flightControlId);
    clearTimeout(this.timeOverId);
    clearTimeout(this.triggerFlightControlId);
}


/**
 * react on any exiting event like STRG+C or KILL
 */
Drone.prototype.onExit = function() {

    this.log("Received EXIT command");

    if(this.state.isFlying == true) {
        this.landing("landing on exit event");
    }

    process.exit(1);

};


/**
 * perform an emergency landing of the drone at the place where it is standing
 *
 */
Drone.prototype.emergencyLand = function() {

    this.log("============= EMERGENCY LANDING NOW!");
    // stop drone etc.
    this.bebop.stop();

    this.bebop.land(this.cleanUpAfterLanding.bind(this));
    this.state.isFlying = false;
    //this.log('changed flying state to: ' + this.state.isFlying, 'isFlying', this.state.isFlying, 0);

    if(this.testMode == true) {
        this.cleanUpAfterLanding();
    }

};

