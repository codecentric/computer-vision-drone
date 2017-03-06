/**
 * Created by tobias on 15.02.17.
 */



var Buzzer = require('../../../main/drone/sensors/Buzzer')

var distanceWarner = new Buzzer(19, 'distanceWarner');
var distanceWarner2 = new Buzzer(26, 'dxistanceWarner');

setTimeout(function() {
    distanceWarner.switch(Buzzer.ON);
    distanceWarner2.switch(Buzzer.ON);
}, 0);


setTimeout(function() {
    distanceWarner.switch(Buzzer.OFF)
    distanceWarner2.switch(Buzzer.OFF)
}, 300);