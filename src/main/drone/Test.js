/**
 * Created by raphael on 10.04.17.
 */
const fork = require('child_process').fork;

var httpServer = fork('./http/httpServer.js');

setTimeout(function () {
    httpServer.kill('SIGINT');
}, 5000);
