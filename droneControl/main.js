/**
 * Created by raphael on 06.02.17.
 */
require("storotype");
var bebop = require('node-bebop');
var drone = bebop.createClient();
const eol = require('os').EOL;
const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
const MOVEMENT_SPEED = 10;
var rotate = false;

// Fallback actions for safe landing in case of exit or error
process.stdin.resume();//so the program will not close instantly

// forces the drone to land and rhe close the program
function kill() {
    drone.land();

    for (var i = 0; i <= 10; i++) {
        drone.land();
    }
    drone.on("landed", function () {
        process.exit();
    });
    setTimeout(function () {
        console.log("No Landing message recieved. STOP!");
        process.exit();
    }, 2000);
};

const keyMap = new Map();
keyMap.set('up', drone.takeOff());
keyMap.set('down', drone.land());
keyMap.set('left', drone.left(MOVEMENT_SPEED));
keyMap.set('right', drone.right(MOVEMENT_SPEED));
keyMap.set('w', drone.up(MOVEMENT_SPEED));
keyMap.set('s', drone.down(MOVEMENT_SPEED));
keyMap.set('d', drone.clockwise(MOVEMENT_SPEED));
keyMap.set('a', drone.counterClockwise(MOVEMENT_SPEED));
keyMap.set('space', drone.stop());

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
//catches kill event
process.on('SIGTERM', function (){
    kill();
    console.log("Landing due to kill. ");
});

//catches uncaught exceptions
process.on('uncaughtException', function (err){
    kill();
    console.log(err);
    console.log("Landing due to Exception.");
});
/*

cotrol the user keyboard input

 */

process.stdin.on('keypress', function (ch,key) {
    console.log('got "keypress"', key);
    if (key.ctrl && key.name === 'c') {
        process.exit(); // eslint-disable-line no-process-exit
    } else {
        switch (key.name) {
            case 'up':
                drone.takeOff();
                console.log("takeOff");
                break;
            case 'down':
                drone.land();
                break;
            case 'left':
                drone.left(MOVEMENT_SPEED);
                break;
            case 'right':
                drone.right(MOVEMENT_SPEED);
                break;
            case 'w':
                drone.up(MOVEMENT_SPEED);
                break;
            case 's':
                drone.down(MOVEMENT_SPEED);
                break;
            case 'a':
                drone.counterClockwise(MOVEMENT_SPEED);
                break;
            case 'd':
                drone.clockwise(MOVEMENT_SPEED);
                break;
            case 'space':
                drone.stop();
                break;
            default:
                console.log(`No symbol defined for "${key.name}" key.`);
        }
    }

});
process.stdin.resume();

/*
setup the drone
 */
drone.connect(function () {
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
    });
    //drone.takeOff();

    //const exec = require('child_process').exec;
    //const ls = exec('vlc ./bebop.sdp');

    });