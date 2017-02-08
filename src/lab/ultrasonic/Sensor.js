/**
 * Created by tobias on 06.02.17.
 */

var usonic     = require('mmm-usonic');
var statistics = require('math-statistics');

/* the GPIO pins */
var gpioTrigger;
var gpioEcho;

/* hold the real sensor */
var sensor;

/* the name of the sensor to identify it */
var name;

///* hold the last measured distance */
//var currentDistance = -1;

/* hold some measured distances */
var distances = [];

var timeout;

var delay;

var rate;




module.exports = Sensor;

function Sensor(gpioTrigger, gpioEcho, name, timeout, delay, rate) {

    /* ===================================================================================== */

    this.gpioTrigger = gpioTrigger;
    this.gpioEcho = gpioEcho;
    this.name = name;
    this.timeout = timeout;
    this.delay = delay;
    this.rate = rate;



    console.log('Configured Pin: trigger:' + gpioTrigger + " / echo: " + gpioEcho);

    /* ===================================================================================== */

    this.getDistance = function() {
        var distance = statistics.median(distances);
        return distance.toFixed(2);
    }


    this.triggerMeasureCycle = function() {

        (function measure() {
            if (!distances || distances.length === rate) {

                /*
                 if (distances) {
                 print(distances);
                 }
                 */

                distances = [];
            }

            setTimeout(function () {
                distances.push(sensor());
                console.log(".");

                measure();
            }, delay);
        }());

    }

    /* ===================================================================================== */

    this.triggerMeasureCycle();

    console.log("initialized sensor [" + name + "] on pins (" + this.gpioTrigger + ", " + this.gpioEcho +")");
}





