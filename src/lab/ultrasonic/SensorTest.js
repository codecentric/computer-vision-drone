/**
 * Created by tobias on 08.02.17.
 */


var usonic = require('mmm-usonic');

var wert = 0;

var sensx;





function change() {

    wert = sensx();

    // recall every 5 seconds
    setTimeout(change, 500);
}


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








