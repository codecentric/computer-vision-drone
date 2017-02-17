/**
 * Created by tobias on 17.02.17.
 */



var mic = require('microphone');

mic.startCapture();

mic.audioStream.on('data', function(data) {
    process.stdout.write(data);
});