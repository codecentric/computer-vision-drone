/* example from https://github.com/mochman/mmm-usonic/blob/master/examples/surveyor.js */


'use strict';

var readline   = require('readline');
var statistics = require('math-statistics');
var usonic     = require('mmm-usonic');

var print = function (distances) {
    var distance = statistics.median(distances);

    process.stdout.clearLine();
    process.stdout.cursorTo(0);

    if (distance < 0) {
        process.stdout.write('Error: Measurement timeout.\n');
    } else {
        process.stdout.write('Distance: ' + distance.toFixed(2) + ' cm');
    }
};

var initSensor = function (config) {
    var sensor = usonic.createSensor(config.echoPin, config.triggerPin, config.timeout);

    console.log('Config: ' + JSON.stringify(config));

    var distances;

    (function measure() {
        if (!distances || distances.length === config.rate) {
            if (distances) {
                print(distances);
            }

            distances = [];
        }

        setTimeout(function () {
            distances.push(sensor());

            measure();
        }, config.delay);
    }());
};

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var askForInteger = function (name, defaultValue, callback) {
    rl.question(name + ' (default ' + defaultValue + '): ', function (response) {
        var value = parseInt(response, 10);

        callback(isNaN(value) ? defaultValue : value);
    });
};

askForInteger('Echo pin', 24, function (echoPin) {
    askForInteger('Trigger pin', 23, function (triggerPin) {
        askForInteger('Measurement timeout in µs', 750, function (timeout) {
            askForInteger('Measurement delay in ms', 60, function (delay) {
                askForInteger('Measurements per sample', 5, function (rate) {
                    rl.close();

                    usonic.init(function (error) {
                        if (error) {
                            console.log(error);
                        } else {
                            initSensor({
                                echoPin: echoPin,
                                triggerPin: triggerPin,
                                timeout: timeout,
                                delay: delay,
                                rate: rate
                            });
                        }
                    });
                });
            });
        });
    });
});
