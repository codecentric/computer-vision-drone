/**
 * @Author Tobias Schaber, codecentric AG
 *
 * This class is used to switch on or off an acoustic buzzer or a LED mounted on the drone.
 *
 * Simply use the constructor to create a new buzzer/LED and switch it on or off with the
 * switch() method.
 *
 * See https://github.com/Soarez/node-wiring-pi for details to the library
 */


'use strict'


var wpi = require('wiring-pi');

module.exports = Buzzer;


/**
 * constructor to create a new buzzer.
 * @param pinOut the data pin on which the buzzer/LED is connected to
 * @param name the name of this buzzer
 * @constructor
 */
function Buzzer(pinOut, name) {
    this.pinOut = pinOut;
    this.name = name;

    wpi.setup('gpio');
    wpi.pinMode(this.pinOut, wpi.OUTPUT);
    wpi.digitalWrite(this.pinOut, wpi.LOW);
}

/* define constants for outer usage */
Buzzer.OFF = 0;
Buzzer.ON = 1;

/**
 * switch the buzzer or LED on or off.
 * @param mode takes Buzzer.ON to turn the buzzer on or Buzzer.OFF to switch the buzzer off.
 */
Buzzer.prototype.switch = function(mode) {
    if(mode == Buzzer.ON) {
        wpi.digitalWrite(this.pinOut, wpi.HIGH);
    } else {
        wpi.digitalWrite(this.pinOut, wpi.LOW);
    }
}


/**
 * switch the buzzer/LED on for a given delay in ms
 * @param delay
 */
Buzzer.prototype.onOff = function(delay) {
    setTimeout(this.switch.bind(this, Buzzer.ON), 0);
    setTimeout(this.switch.bind(this, Buzzer.OFF), delay);
}




/**
 * let the buzzer or LED blink
 * @param times how often should we blink?
 * @param delay time in ms between two ON states
 */
Buzzer.prototype.blink = function(times, delay) {

    for(var i=0; i<times; i++) {
        setTimeout(this.switch.bind(this, Buzzer.ON), (i*delay));
        setTimeout(this.switch.bind(this, Buzzer.OFF), (i*delay)+(delay/2));
    }
}

