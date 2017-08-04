/**
 * Created by raphael on 31.03.17.
 */

$(window).load(function () {
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
        // add the correct IP

        var socket = new WebSocket("ws://" + window.location.hostname + ":8000");
        //var socket = new WebSocket("ws://10.10.58.104:8000");
        //var socket = new WebSocket("ws://localhost:8000");
        var first = true;
        var distInterval;
        var leftChart = initHighchart('leftChart', "Left Sensor Data");
        var frontChart = initHighchart('frontChart', "Front Sensor Data");
        var rightChart = initHighchart('rightChart', "Right Sensor Data");

        var radar = Highcharts.chart('radar', {

            chart: {
                polar: true,
                //width: 300
                height: 400

            },
            legend: {
                enabled: false
            },

            title: {
                text: ''
            },

            pane: {
                startAngle: -45,
                endAngle: 45
            },

            xAxis: {
                tickInterval: 15,
                min: 0,
                max: 90,
                labels: {
                    formatter: function () {
                        return this.value - 45;
                    }
                }
            },

            yAxis: {
                min: 0,
                max: 320,
                tickInterval: 15,
            },

            plotOptions: {
                series: {
                    pointStart: 0,
                    pointInterval: 30
                },
                column: {
                    pointPadding: 1,
                    groupPadding: 1
                }
            },

            series: [{
                type: 'column',
                name: 'Column',
                data: [120, 320, 200],
                pointPlacement: 'between'
            }]
        });

        // Nach dem öffnen des Sockets den Status anzeigen
        socket.onopen = function () {
            message('Connection ' + socket.readyState + ' (open)');
            setLabelColor('#status-websocket', true);
            socket.send('webui')
            setTimeout(function () {
                distInterval = setInterval(function () {
                    updateDistanceView('#leftSensor > div.progress-bar', leftChart, distances.left, 0);
                    updateDistanceView('#frontSensor > div.progress-bar', frontChart, distances.front, 1);
                    updateDistanceView('#rightSensor > div.progress-bar', rightChart, distances.right, 2);
                }, 200);

            }, 400);

        }
        // Nach dem empfangen einer Nachricht soll diese angezeigt werden
        socket.onmessage = function (msg) {
            message(msg.data);
        }
        socket.onclose = function() 	{
            message('Connection (close)');
            setLabelColor('#status-websocket', 'danger');
            clearInterval(distInterval);
        }

        socket.onerror = function () {
            socket = new WebSocket("ws://localhost:8000");
            clearInterval(distInterval);
        }


        var progressBarLevelsSensors = [80, 120, 320];
        var progressBarLevelsBattery = [10, 25, 100];
        var distances = {'left' : 0, 'front' : 0, 'right' : 0};
        function initHighchart(selector, title) {
            let chart = Highcharts.chart(selector, {
                title: {
                    text: ''
                },
                subTitle:{
                    text:''
                },
                legend: {
                    enabled: false
                },
                yAxis: {
                    max: 320,
                    min: 0,
                },
                series: [{
                    data: []
                }]

            });
            for (var i = 0; i <= 30; i++) {
                chart.series[0].addPoint(0, false);
            }
            return chart;
        }
        // Funktion die die Nachrichten an das Log anfügt
        function message(msg) {
            try {
                var json = JSON.parse(msg);
                //console.log(JSON.stringify(json));
                if (json.debugLevel >= 1) {
                    $('#Log').prepend(JSON.stringify(json.key).slice(1,-1) + ' : ' + JSON.stringify(json.message).slice(1,-1) + '</br>');
                }

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
                    case 'testMode' :
                        setLabelColor('#status-testmode', json.value);
                        break;
                    case 'distLeft' :
                        distances.left = json.value;
                        break;
                    case 'distFront' :
                        distances.front = json.value;
                        break;
                    case 'distRight' :
                        distances.right = json.value;
                        break;
                    case 'batteryLevel' :
                        updateProgressBar('#batteryLevel > div', json.value, '%', progressBarLevelsBattery);
                        break;
                    case 'turningDirection' :
                        updateTurning('#turningDirection > span', json.value);
                        break;
                    case 'turning' :
                        updateSpeed('#turningSpeed > span', json.value);
                        break;
                    case 'forward' :
                        updateSpeed('#forwardSpeed > span', json.value);
                        break;
                    default:
                        console.log('undefined key: ' + json.key + ' with the value: ' + json.value);

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

            function updateDistanceView(selector,chart, value, radarIndex) {
            updateProgressBar(selector, value , 'cm', progressBarLevelsSensors);
            //updateSensorChart(chart, value);
            updatehighcharts(chart, value);
            updateRadarValue(value, radarIndex);
        }

        function updateRadarValue(value, dataIndex, steps) {
            var color;
            var steps = steps || [70, 140, 320];

            //console.log(data);
            //console.log(steps[0]);
            if (value < steps[0]) {
                color = '#d9534f'; // red
            } else if (value < steps[1]) {
                color = '#f0ad4e'; // orange
            }else if (value < steps[2]) {
                color = '#5cb85c'; // green
            }else {
                color =  '#337ab7' // blue
            }
            radar.series[0].data[dataIndex].update({y: value, color: color}, true, false);
        }
        function updateProgressBar(selector, data, unit, steps) {
            var steps = steps || [15, 25, 100];
            var percentage = Math.round(data / steps[2] * 100);
            var unit = unit || '';
            var color;
            //console.log(data);
            //console.log(steps[0]);
            if (data < steps[0]) {
                color = 'danger';
            } else if (data < steps[1]) {
                color = 'warning';
            }else if (data < steps[2]) {
                color = 'success';
            }else {
                color =  'info'
            }

            $(selector).removeClass('progress-bar-success progress-bar-warning progress-bar-danger progress-bar-info');
            $(selector).addClass('progress-bar-' + color).css('min-width', percentage+'%').attr('aria-valuenow', percentage).text(data + unit);
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

        function updatehighcharts (chart, data) {
            chart.series[0].addPoint(Math.round(data), true, true, false);
        }
    }

    connect();

});