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
    this.blockedTime = 200; // time to block the button after pushed in ms
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
 * this is the listener function which will be called on IO action.
 * It will block the button for some time
 */
Button.prototype.triggered = function() {

    /* if the button is on clear state, the push will be executed */
    if(this.pushed == false) {
        this.pushed = true;

        /* immediately execute the callback */
        setTimeout(this.callback, 0);

        /* reset the button after some time */
        setTimeout(this.resetButton.bind(this), this.blockedTime);
    }

}


/**
 * reset the button pushed state
 */
Button.prototype.resetButton = function() {
    this.pushed = false;
}

