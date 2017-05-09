/**
 * Created by raphael on 04.05.17.
 */
'use strict';
const usonic = require('mmm-usonic');
const DistanceSensor = require('./sensors/DistanceSensor.js');

const sensorRefreshIntervall = 20;

usonic.init((error) => {
    if (error) {
        process.send({error: "error setting up ultrasonic sensor module: " + error.message});
    } else {
        process.on('message', (m) => {
            //process.send({msg: m.hello});
            //process.send({message: 'recieved Data Request'});

        });

        const sensorRight = new DistanceSensor(17, 5, "right", sensorRefreshIntervall);
        const sensorFront = new DistanceSensor(27, 6, "front", sensorRefreshIntervall);
        const sensorLeft = new DistanceSensor(22, 13, "left", sensorRefreshIntervall);
        sensorFront.triggerStart();
        sensorLeft.triggerStart();
        sensorRight.triggerStart();
        sendData(sensorFront, sensorLeft, sensorRight);
        /* send success mesage to parent */
    }
});
function sendData (front, left, right) {
    setTimeout(() => {
        setInterval(() => process.send({distanceData: {front:front.getDistance(), left: left.getDistance(), right: right.getDistance()}}), 100)
    }, 500);

}
process.send({message:'sensorInitialized'});
process.send({message:'refreshSensor'});


