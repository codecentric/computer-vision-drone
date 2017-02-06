/**
 * Created by raphael on 06.02.17.
 */
var bebop = require('node-bebop');
var drone = bebop.createClient();
var keypress = require('keypress');
keypress(process.stdin);
// set drone Settings

var rotate = false;

// Fallback actions for safe landing in case of exit or error
process.stdin.resume();//so the program will not close instantly

// forces the drone to land and rhe close the program
function kill() {
    drone.land();
    drone.on("landed", function () {
        process.exit();
    });
    setTimeout(function () {
        console.log("No Landing message recieved. STOP!");
        process.exit();
    }, 2000);
};


//do something when app is closing
process.on('exit', function (){
    console.log("Landing due to exit ");
    kill();
});

//catches ctrl+c event
process.on('SIGINT', function (){
    kill();
    console.log("Landing due to ctr+c. ");
});

//catches uncaught exceptions
process.on('uncaughtException', function (err){
    kill();
    console.log(err);
    console.log("Landing due to Exception. Pressed Space?");
});
/*

cotrol the user keyboard input

 */

process.stdin.on('keypress', function (ch,key) {
    console.log('got "keypress"', key);

    if (key.name == 'up') {
        console.log("TakeOff");
        drone.takeOff();
    }
    if (key.name == 'down') {
        console.log("Landing");
        drone.land();
    }
    if (key.name == 'right') {
        if (rotate) {
            drone.stop();
            rotate = false;
        }
        else {
            console.log("TurnClockwise");
            drone.clockwise(15);
            rotate = true;
        }


    }
    if (key.name == 'left') {
        if (rotate) {
            drone.stop();
            rotate = false;
        }
        else {
            console.log("TurnCounterClockwise");
            drone.counterClockwise(15);
            rotate = true;
        }

    }
    if (key.name == 'w') {
        drone.up(15);
    }

    if (key.name == 's') {
        drone.down(15);
    }

    if (key.name == 'd') {
        drone.stop();
    }
    if (key.name == 'space') {
        throw new Error;

    }
});
process.stdin.resume();

/*
setup the drone
 */
drone.connect(function () {
    var ready = true;
    setTimeout(function () {
        ready = false;
    },4000);
    // activate videostreaming
    drone.MediaStreaming.videoStreamMode(0);
    drone.PictureSettings.videoStabilizationMode(3);
    drone.MediaStreaming.videoEnable(1);
    drone.PilotingSettings.maxAltitude(2);

    // for safty reasons
    drone.on("battery", function (data) {
        console.log("Battery: " + data);
        if (data <= 3){
            kill();
        }
    });

    drone.on("AltitudeChanged", function (data) {
        console.log("AltitudeChanged: " + data.altitude);
        if (ready && data.altitude >= 0.5){
            if (data.altitude >= 1.5){
                drone.stop();
            } else {
                drone.up(15);
            }
        }
    });
    //drone.takeOff();


});