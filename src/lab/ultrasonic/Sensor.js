/**
 * Created by tobias on 06.02.17.
 */

var usonic     = require('mmm-usonic');

/* the GPIO pins */
var gpioTrigger;
var gpioEcho;

/* hold the real sensor */
var sensor;

/* the name of the sensor to identify it */
var name;

/* hold the last measured distance */
var currentDistance = -1;

module.exports = Sensor;

function Sensor(gpioTrigger, gpioEcho, name) {

    this.gpioTrigger = gpioTrigger;
    this.gpioEcho = gpioEcho;
    this.name = name;

    this.sensor = usonic.createSensor(this.gpioEcho, this.gpioTrigger, 750, 60, 5);
    console.log('Configured Pin: ' + gpioTrigger + " / " + gpioEcho);



    this.getDistance = function() {
        return currentDistance;
    }

    this.measureDistance = function() {

        /* take some time... */
        for(i=0; i<1000; i++) {
            for(j=0; j<1000; j++) {
                for(k=0; k<1000; k++) {

                }
            }
        }
        process.nextTick(measureDistance);

        console.log("measured...");
        currentDistance = currentDistance + 1;

    }


    this.measureDistance();

    console.log("initialized sensor [" + name + "] on pins (" + this.gpioTrigger + ", " + this.gpioEcho +")");
}





