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

exports.ON = 1;
exports.OFF = 0;

module.exports = Buzzer;


function Buzzer(pinOut, name) {
    this.pinOut = pinOut;
    this.name = name;

    wpi.setup('gpio');
    wpi.pinMode(this.pinOut, wpi.modes.OUTPUT);
}


Buzzer.prototype.switch = function(mode) {
    if(mode == Buzzer.ON) {
        wpi.digitalWrite(this.pinOut, wpi.HIGH);
    } else {
        wpi.digitalWrite(this.pinOut, wpi.LOW);
    }
}





