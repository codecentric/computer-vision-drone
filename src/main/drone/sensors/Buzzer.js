/**
 * @Author Tobias Schaber, codecentric AG
 *
 * This class is used to switch on or off an acoustic buzzer mounted on the drone.
 *
 * Simply use the constructor to create a new buzzer and switch it on or off with the
 * switch() method.
 *
 * See https://github.com/Soarez/node-wiring-pi for details to the library
 */


'use strict'


var wpi = require('wiring-pi');

module.exports = Buzzer;


/**
 * constructor to create a new buzzer.
 * @param pinOut the data pin on which the buzzer is connected to
 * @param name the name of this buzzer
 * @constructor
 */
function Buzzer(pinOut, name) {
    this.pinOut = pinOut;
    this.name = name;

    wpi.setup('gpio');
    wpi.pinMode(this.pinOut, wpi.OUTPUT);
}

/* define constants for outer usage */
Buzzer.OFF = 0;
Buzzer.ON = 1;

/**
 * switch the buzzer on or off.
 * @param mode takes Buzzer.ON to turn the buzzer on or Buzzer.OFF to switch the buzzer off.
 */
Buzzer.prototype.switch = function(mode) {
    if(mode == Buzzer.ON) {
        wpi.digitalWrite(this.pinOut, wpi.HIGH);
    } else {
        wpi.digitalWrite(this.pinOut, wpi.LOW);
    }
}

