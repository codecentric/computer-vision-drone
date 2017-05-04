/**
 * Created by raphael on 04.05.17.
 */
'use strict';
const usonic = require('mmm-usonic');
const DistanceSensor = require('./sensors/DistanceSensor.js');

const sensorRefreshIntervall = 40;

usonic.init((error) => {
    if (error) {
        process.send({error: "error setting up ultrasonic sensor module: " + error.message});
    } else {
        const sensorRight = new DistanceSensor(17, 5, "right", sensorRefreshIntervall);
        const sensorFront = new DistanceSensor(27, 6, "front", sensorRefreshIntervall);
        const sensorLeft = new DistanceSensor(22, 13, "left", sensorRefreshIntervall);
        sensorFront.triggerStart();
        sensorLeft.triggerStart();
        sensorRight.triggerStart();
        /* send success mesage to parent */
        process.send({message:'sensorInitialized'});
        process.send({message:'refreshSensor'});
        process.on('message', (m) => {
            //process.send({msg: m.hello});

            if (m.msg === 'getData') {
                process.send({distanceData: {front:sensorFront.getDistance(), left: sensorLeft.getDistance(), right: sensorRight.getDistance()}})
            }
        });
    }
});




