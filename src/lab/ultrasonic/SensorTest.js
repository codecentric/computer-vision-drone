/**
 * Created by tobias on 08.02.17.
 */


var usonic = require('mmm-usonic');

var wert = 0;

var sensx;





function change() {

    wert = sensx();

    // recall every 5 seconds
    setTimeout(change, 5000);
}

/* REPLACED BY SETINTERVAL
function getWert() {
    console.log(wert);

    // recall every 4 seconds
    setTimeout(getWert, 4000);
} */

//TODO setInterval probieren

setInterval(function () {
   console.log(wert);
}, 1000);







    usonic.init(function (error) {
        if (error) {
            console.log("FEHLER :(");
            console.log(error);
        } else {
            console.log("X");
            sensx = usonic.createSensor(24, 23, 450);
            change();
            getWert();
        }
    });








