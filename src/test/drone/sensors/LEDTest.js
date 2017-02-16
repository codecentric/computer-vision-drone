/**
 * Created by tobias on 15.02.17.
 */



var Buzzer = require('../../../main/drone/sensors/Buzzer')

var onboardLED = new Buzzer(26, 'onboardLED');

onboardLED.blink(3, 1000);
