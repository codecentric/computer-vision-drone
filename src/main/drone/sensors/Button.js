/**
 * @Author Tobias Schaber, codecentric AG
 *
 * This class is used to catch events from a button.
 *
 * Simply use the constructor to create a new button and register a callable which
 * will be called after pushing the button
 *
 */


'use strict'


var wpi = require('wiring-pi');

module.exports = Button;


/**
 * constructor to create a new button.
 * @param pinIn the data pin on which the button is connected to
 * @param name the name of this button
 * @constructor
 */
function Button(pinIn, name, callback) {
    this.pinIn = pinIn;
    this.name = name;
    this.pushed = false;
    this.callback = callback;

    /* GPIO setup and trigger registration */
    wpi.setup('gpio');
    wpi.pinMode(this.pinIn, wpi.INPUT);
    wpi.pullUpDnControl(this.pinIn, wpi.PUD_UP);
    wpi.wiringPiISR(this.pinIn, wpi.INT_EDGE_RISING, this.triggered.bind(this));
}


/**
 * this is the listener function which will be called on IO action
 */
Button.prototype.triggered = function() {

    if (wpi.digitalRead(this.pinIn)) {
        if (false === this.pushed) {
            this.pushed = true;

            /* immediately execute the callback */
            setTimeout(this.callback, 0);
        }
    } else {
        this.pushed = false;
    }
}
