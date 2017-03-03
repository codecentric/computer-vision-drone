/**
 * @Author Raphael Manke, codecentric AG
 *
 * This class is used to record from a microphone an listens to a hotword.
 *
 * Simply use the constructor to create a new microphone listener.
 *
 */

'use-strict'

module.exports = Voice;

const record = require('node-record-lpcm16');
const Detector = require('snowboy').Detector;
const Models = require('snowboy').Models;

function Voice(debug) {
    const models = new Models();

    models.add({
        file: 'resources/Drohne_Stop.pmdl',
        sensitivity: '0.5',
        hotwords : 'snowboy'
    });

    this.detector = new Detector({
        resource: "resources/common.res",
        models: models,
        audioGain: 2.0
    });
    if (debug) {
        this.detector.on('silence', function () {
            console.log('silence');
        });

        this.detector.on('sound', function () {
            console.log('sound');
        });

        this.detector.on('error', function () {
            console.log('error');
        });

        this.detector.on('hotword', function (index, hotword) {
            console.log('hotword', index, hotword);
        });

    }
     const mic = record.start({
        threshold: 0,
        verbose: true
    });

    mic.pipe(this.detector);
}
