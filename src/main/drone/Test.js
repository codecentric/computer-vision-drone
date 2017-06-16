const fork = require('child_process').fork;

var sensors = fork(__dirname + '/Sensor.js');
sensors.on('message', (msg) => console.log(msg))
sensors.send({msg: 'getData'})