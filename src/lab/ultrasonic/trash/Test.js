



var Sensor = require('./Sensor.js');




var distances = {};

sensorFront = new Sensor(9, 10, "front", 750, 60, 5);


distances[sensorFront] = -1;


change = function(sensorToChange, newDistance) {
    distances[sensorToChange] = newDistance;
    console.log("updated dist");
    setTimeout(change, 2000);
}



getWert = function() {
    console.log(wert);
    setTimeout(getWert, 5000);
}


change();
getWert();




//while(true) {



//}