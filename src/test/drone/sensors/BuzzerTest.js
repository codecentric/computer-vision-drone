/**
 * Created by tobias on 15.02.17.
 */



var Buzzer = require('../../../main/drone/sensors/Buzzer')

var distanceWarner = new Buzzer(5, 'distanceWarner');

setTimeout(function() {
    distanceWarner.switch(Buzzer.ON);
}, 1000);


setTimeout(function() {
    distanceWarner.switch(Buzzer.OFF)
}, 1500);