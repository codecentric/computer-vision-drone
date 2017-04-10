/**
 * Created by raphael on 03.04.17.
 */
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({host: '0.0.0.0',port: 8000});
var events = require('events');
var filepath = require('filepath');
var WatchJS = require("melanke-watchjs");
var watch = WatchJS.watch;
var unwatch = WatchJS.unwatch;
var callWatchers = WatchJS.callWatchers;

const eventEmitter = new events.EventEmitter();
const fork = require('child_process').fork;


var fs = require('fs');
var path = require('path');
var http = require('http');
var httpServer = fork(filepath.create(__dirname, '../httpServer.js'));

var speed = {};
var state = {};
speed.forward  = 0;            // current forward speed of the drone
speed.turning  = 0;            // current turning speed of the drone ( > 0 = clockwise)
speed.turningDirection = 0;    // -1 =
speed.strafing = 0;            // current strafing speed of the drone ( > 0 = right direction)
speed.maxForward = 15;         // maximum forward speed
speed.maxTurning = 40;         // turning speed if turning is active
speed.maxStrafing = 0;         // maximum strafing speed
speed.accVectorForward = 3;    // difference of speed when performing one acceleration step forwards
speed.accVectorBackward = 5;   // difference of speed when breaking the drone one step
speed.accVectorStrafing = 0;   // difference of speed when accelerating into strafing direction
state.movementLocked = false;        // checks if further movement orders are accepted

/* is the drone ready for takeoff?
 setting to "false" in the constructor will prevent the drone from starting up */
state.readyForTakeoff = undefined;   // setting to false in constructor will prevent from
state.isFlying = false;              // is the drone currently flying?
state.isWLANConnected = false;       // is the pi connected to WLAN of the drone?
state.isDroneConnected = false;      // is the connection to the drone stable?
state.isReconnecting = false;        // is the drone currently reconnecting?
state.distFront = 999;
state.distLeft = 999;
state.distRight = 999;

//process.on('exit', onExit());
//process.on('SIGINT', onExit());    // CTRL+C
//process.on('SIGTERM', onExit());  // KILL
//process.on('uncaughtException', onExit());   // UNCAUGHT EXCEPTIONS

function onExit() {
    httpServer.kill('SIGINT');
    process.exit(1);
}
watch(state, function (prop, action, newvalue, oldvalue) {
    /* log to event emitter for web UI */
    eventEmitter.emit("webHUD", JSON.stringify({'key' : prop, 'value' : newvalue}));
    //console.log("webHUD", JSON.stringify({'key' : prop, 'value' : newvalue}));
},0);
watch(speed, function (prop, action, newvalue, oldvalue) {
    /* log to event emitter for web UI */
    eventEmitter.emit("webHUD", JSON.stringify({'key' : prop, 'value' : newvalue}));
},0);


wss.on('connection', function(ws) {
    console.log("websocket server ready");
    eventEmitter.on('webHUD', function(message) {
        try {
            ws.send(message);
        }   catch (error) {
            if (error != 'Error: not opened') {
                console.log('Websocket error: %s', error);
            }
            clearTimeout(test1);
            clearTimeout(test2);
            clearInterval(test3);
            clearInterval(test4);
            clearInterval(test5);
            clearInterval(test6);
            clearInterval(test7);
            ws.close();

        }
    });
    ws.on('close', function () {
        console.log('disconnecting client ');
    });
    ws.on('error', function () {
        console.log('Error');
        ws.close();
    });

    var test1 = setTimeout(function () {
        log("==================== T E S T M O D E =============");
    }, 2000);
    var test2 = setTimeout(function () {
        state.isFlying = true;
        //log('changed flying state to: ' + true, 'isFlying', true);

        //log("received starting signal for takeoff.", debuglevel=0);
    }, 2000);
    var test3 = setInterval(function () {
        state.distFront = Math.floor(Math.random() * 320) + 1;
        state.distLeft = Math.floor(Math.random() * 320) + 1;
        state.distRight = Math.floor(Math.random() * 320) + 1;
        ////log('Distance Front: ' + distFront, 'distFront', distFront);
        ////log('Distance Left: ' + distLeft, 'distLeft', distLeft, 0);
        ////log('Distance Right: ' + distRight, 'distRight', distRight, 0);
    }, 200);
    var test4 = setInterval(function () {
        speed.turning = Math.floor(Math.random() * 100) + 1;
        //log('turning speed set to: ' + turningSpeed, 'turningSpeed', turningSpeed, 1)
    }, 1000);

    var test5 = setInterval(function () {
        speed.forward = Math.floor(Math.random() * 100) + 1;
        //log('forward speed set to: ' + forwardSpeed, 'forwardSpeed', forwardSpeed, 1)
    }, 1000);

    var test6 = setInterval(function () {
        state.batteryLevel = Math.floor(Math.random() * 100) + 1;
        //log("\rbattery level: " + batteryLevel +  "%", 'batteryLevel', batteryLevel);
    }, 1000);

    var test7 = setInterval(function () {
        var boolean = Math.floor(Math.random() * 100) +1;
        var direction = 0
        if (boolean < 33) {
            speed.turningDirection = -1;
        } else  {
            if (boolean > 66) {
                speed.turningDirection = 1;
            } else {
                speed.turningDirection = 0;
            }
        }
        //log('Turning Direction changed: ' + direction, 'turningDirection', direction, 0);
    }, 2000);
    setTimeout(function () {
        eventEmitter.emit("webHUD", JSON.stringify({'key' : 'ABC', 'value' : 'TEST'}));
    },5000);
});


function log(message, key, value, debugLevel) {

    /* assume "log" as key if not provided */
    this.key = key || "log";
    /* assume "NULL" as value if not provided */
    this.value = value || null;
    /* assume "1" as debugLevel if not provided */
    this.debugLevel = debugLevel || 1;

    /* log "log" keys to stdout */
    if(key == "log") {
        console.log(message);
    }

    var message = {'key' : key, 'value' : value};

    /* log to event emitter for web UI */
    //eventEmitter.emit("webHUD", JSON.stringify(message));
}

