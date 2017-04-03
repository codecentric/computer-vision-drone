/**
 * Created by raphael on 03.04.17.
 */
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({host: '0.0.0.0',port: 8000});
var events = require('events');
const eventEmitter = new events.EventEmitter();

wss.on('connection', function(ws) {
    console.log("websocket server ready");
    eventEmitter.on('webHUD', function(message) {
        ws.send(message);
    });

    setTimeout(function () {
        log("==================== T E S T M O D E =============", 'testmode', this.testMode, 0);
    }, 2000);
    setTimeout(function () {
        log('changed flying state to: ' + true, 'isFlying', true, 0);

        log("received starting signal for takeoff.");
    }, 2000);
    setInterval(function () {
        var distFront = Math.floor(Math.random() * 230) + 1
        var distLeft = Math.floor(Math.random() * 230) + 1
        var distRight = Math.floor(Math.random() * 230) + 1
        log('Distance Front: ' + distFront, 'distFront', distFront, 0);
        log('Distance Left: ' + distLeft, 'distLeft', distLeft, 0);
        log('Distance Right: ' + distRight, 'distRight', distRight, 0);
    }, 200);
    setInterval(function () {
        var turningSpeed = Math.floor(Math.random() * 100) + 1
        log('turning speed set to: ' + turningSpeed, 'turningSpeed', turningSpeed, 0)
    }, 1000);

    setInterval(function () {
        var forwardSpeed = Math.floor(Math.random() * 100) + 1
        log('forward speed set to: ' + forwardSpeed, 'forwardSpeed', forwardSpeed, 0)
    }, 1000);

    setInterval(function () {
        var batteryLevel = Math.floor(Math.random() * 100) + 1
        log("\rbattery level: " + batteryLevel +  "%", 'batteryLevel', batteryLevel);
    }, 1000);

    setInterval(function () {
        var boolean = Math.floor(Math.random() * 100) +1;
        var direction = 0
        if (boolean < 33) {
            direction = -1;
        } else  {
            if (boolean > 66) {
                direction = 1;
            } else {
                direction = 0;
            }
        }
        log('Turning Direction changed: ' + direction, 'turningDirection', direction, 0);
    }, 2000);

});

function log(message, key, value, debugLevel) {

    /* assume "log" as key if not provided */
    key = key || "log";
    /* assume "NULL" as value if not provided */
    value = value || null;
    /* assume "1" as debugLevel if not provided */
    value = value || 1;

    /* log "log" keys to stdout */
    if(key == "log") {
        console.log(message);
    }

    var message = {'key' : key, 'message' : message, 'value' : value};

    /* log to event emitter for web UI */
    eventEmitter.emit("webHUD", JSON.stringify(message));
}

