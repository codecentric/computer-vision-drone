/**
 * Created by raphael on 03.04.17.
 */
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({host: '0.0.0.0',port: 8000});
var events = require('events');
const eventEmitter = new events.EventEmitter();


var fs = require('fs');
var path = require('path');
var http = require('http');

var staticBasePath = '../static';

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
        log("==================== T E S T M O D E =============", 'testmode', this.testMode, 0);
    }, 2000);
    var test2 = setTimeout(function () {
        log('changed flying state to: ' + true, 'isFlying', true);

        log("received starting signal for takeoff.", debuglevel=0);
    }, 2000);
    var test3 = setInterval(function () {
        var distFront = Math.floor(Math.random() * 320) + 1
        var distLeft = Math.floor(Math.random() * 320) + 1
        var distRight = Math.floor(Math.random() * 320) + 1
        log('Distance Front: ' + distFront, 'distFront', distFront);
        log('Distance Left: ' + distLeft, 'distLeft', distLeft, 0);
        log('Distance Right: ' + distRight, 'distRight', distRight, 0);
    }, 200);
    var test4 = setInterval(function () {
        var turningSpeed = Math.floor(Math.random() * 100) + 1
        log('turning speed set to: ' + turningSpeed, 'turningSpeed', turningSpeed, 1)
    }, 1000);

    var test5 = setInterval(function () {
        var forwardSpeed = Math.floor(Math.random() * 100) + 1
        log('forward speed set to: ' + forwardSpeed, 'forwardSpeed', forwardSpeed, 1)
    }, 1000);

    var test6 = setInterval(function () {
        var batteryLevel = Math.floor(Math.random() * 100) + 1
        log("\rbattery level: " + batteryLevel +  "%", 'batteryLevel', batteryLevel);
    }, 1000);

    var test7 = setInterval(function () {
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
    this.key = key || "log";
    /* assume "NULL" as value if not provided */
    this.value = value || null;
    /* assume "1" as debugLevel if not provided */
    this.debugLevel = debugLevel || 1;

    /* log "log" keys to stdout */
    if(key == "log") {
        console.log(message);
    }

    var message = {'key' : key, 'message' : message, 'value' : value, 'debugLevel' : debugLevel};

    /* log to event emitter for web UI */
    eventEmitter.emit("webHUD", JSON.stringify(message));
}

