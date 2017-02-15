/**
 * Created by tobias on 15.02.17.
 */

var Button = require('../../../main/drone/sensors/Button')

var startButton = new Button(23, "startButton", function() { console.log("pushed me")});


setTimeout(function() {
    console.log("exiting");
}, 3000);