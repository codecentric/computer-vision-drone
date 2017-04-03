/**
 * Created by raphael on 31.03.17.
 */


$(document).ready(function () {
    /**
     * Clock
     */
    // Create two variable with the names of the months and days in an array
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    // Create a newDate() object
    var newDate = new Date();
    // Extract the current date from Date object
    newDate.setDate(newDate.getDate());
    // Output the day, date, month and year
    $('#Date').html(dayNames[newDate.getDay()] + " " + newDate.getDate() + ' ' + monthNames[newDate.getMonth()] + ' ' + newDate.getFullYear());

    setInterval(function () {
        // Create a newDate() object and extract the seconds of the current time on the visitor's
        var seconds = new Date().getSeconds();
        // Add a leading zero to seconds value
        $("#sec").html(( seconds < 10 ? "0" : "" ) + seconds);
    }, 1000);

    setInterval(function () {
        // Create a newDate() object and extract the minutes of the current time on the visitor's
        var minutes = new Date().getMinutes();
        // Add a leading zero to the minutes value
        $("#min").html(( minutes < 10 ? "0" : "" ) + minutes);
    }, 1000);

    setInterval(function () {
        // Create a newDate() object and extract the hours of the current time on the visitor's
        var hours = new Date().getHours();
        // Add a leading zero to the hours value
        $("#hours").html(( hours < 10 ? "0" : "" ) + hours);
    }, 1000);


    /**
     * Everything that has to do with the Websocket
     */
    function connect() {
        // Websocket
        var socket = new WebSocket("ws://localhost:8000");

        // Nach dem öffnen des Sockets den Status anzeigen
        socket.onopen = function () {
            message('Connection ' + socket.readyState + ' (open)');
            setLabelColor('#status-websocket', true);
        }
        // Nach dem empfangen einer Nachricht soll diese angezeigt werden
        socket.onmessage = function (msg) {
            message(msg.data);
        }
        socket.onclose = function() 	{
            message('Connection (close)');
            setLabelColor('#status-websocket', 'danger');
        }

        socket.onerror = function () {
        }

        // Funktion welche die Nchrichten an das Log anfügt
        function message(msg) {
            try {
                var json = JSON.parse(msg);
                console.log(JSON.stringify(json));
                $('#Log').prepend(JSON.stringify(json.key).slice(1,-1) + ' : ' + JSON.stringify(json.message).slice(1,-1) + '</br>');
                
                switch (json.key) {
                    case 'isWLANConnected':
                        setLabelColor('#status-droneWlanConnected', json.value);
                        break;
                    case 'isDroneConnected':
                        setLabelColor('#status-droneConnected', json.value);
                        break;
                    case 'isFlying' :
                        setLabelColor('#status-isFlying', json.value);
                        break;
                    case 'movementLocked' :
                        setLabelColor('#status-movementLocked', json.value);
                        break;
                    case 'testmode' :
                        setLabelColor('#status-testmode', json.value);
                        break;
                    case 'distLeft' :
                        updateProgressBar('#leftSensor > div.progress-bar', Math.round(json.value / 320 * 100), 'cm');
                        break;
                    case 'distFront' :
                        updateProgressBar('#frontSensor > div', Math.round(json.value / 320 * 100), 'cm');
                        break;
                    case 'distRight' :
                        updateProgressBar('#rightSensor > div', Math.round(json.value / 320 * 100), 'cm');
                        break;
                    case 'batteryLevel' :
                        updateProgressBar('#batteryLevel > div', json.value, '%');
                        break;
                    case 'turningDirection' :
                        updateTurning('#turningDirection > span', json.value);
                        break;
                    case 'turningSpeed' :
                        updateSpeed('#turningSpeed > span', json.value);
                        break;
                    case 'forwardSpeed' :
                        updateSpeed('#forwardSpeed > span', json.value);
                        break;

                }
                //$('#' + JSON.stringify(json.fieldId).slice(1, -1)).replaceWith(JSON.stringify(json.message));

            } catch (error) {
                $('#Log').prepend(msg + '</br>');
            }
        }
        

        function setLabelColor (selector, boolean) {
            var colorSelector = {
                true: 'success',
                'true': 'success',
                false: 'danger',
                'false': 'danger',
                null : 'default'
            };
            var color =  colorSelector[boolean] || colorSelector[null];
            $(selector).removeClass('label-default');
            $(selector).removeClass('label-danger');
            $(selector).removeClass('label-success');
            $(selector).addClass('label-' + color);
        }

        function updateProgressBar(selector, data, unit) {
            var unit = unit || '';
            var value = Math.round(data / 320);
            console.log(data + value);
            $(selector).css('min-width', data+'%').attr('aria-valuenow', data).text(data + unit);
        }

        function updateTurning(selector, direction) {
            var icon = {
                '0' : 'glyphicon-minus',
                '1' : 'glyphicon-repeat',
                '-1' : 'glyphicon-repeat icon-flipped'
            };

            $(selector).removeClass();
            $(selector).addClass('glyphicon ' + icon[direction]);
        }
        function updateSpeed(selector, speed) {
            $(selector).text(speed);
        }

    }

    connect();

});