/**
 * Created by tobias on 08.02.17.
 */


/* This is a working example for the sensor test */

var usonic = require('mmm-usonic');

var wert = 0;

var sensx;





/* this self calling function will update the value */
function change() {

    wert = sensx();

    // recall every 5 seconds
    setTimeout(change, 500);
}


/* this is only a logger function. it can be removed! */
setInterval(function () {
   console.log(wert);
}, 1000);



usonic.init(function (error) {
    if (error) {
        console.log("FEHLER :(");
        console.log(error);
    } else {
        console.log("created sensor");
        sensx = usonic.createSensor(10, 9, 750, 60, 5);
        change();
    }
});


/* this function will contain the drone steering */
setInterval(function () {
    if( wert < 30) {
        console.log("OH MY GOD! BREAK THE DRONE!! STOP IT!");
    }

}, 200);







