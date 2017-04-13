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
        //console.log(socket.readyState);
        var distInterval;
        /*
         var leftChart = initChart('leftChart', "Left Sensor Data");
         var frontChart = initChart('frontChart', "Front Sensor Data");
         var rightChart = initChart('rightChart', "Right Sensor Data");
         */
        var leftChart = initHighchart('leftChart', "Left Sensor Data");
        var frontChart = initHighchart('frontChart', "Front Sensor Data");
        var rightChart = initHighchart('rightChart', "Right Sensor Data");


        // Nach dem öffnen des Sockets den Status anzeigen
        socket.onopen = function () {
            message('Connection ' + socket.readyState + ' (open)');
            setLabelColor('#status-websocket', true);
            setTimeout(function () {
                distInterval = setInterval(function () {
                    updateDistanceView('#leftSensor > div.progress-bar', leftChart, distances.left);
                    updateDistanceView('#frontSensor > div.progress-bar', frontChart, distances.front);
                    updateDistanceView('#rightSensor > div.progress-bar', rightChart, distances.right);
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
        function initChart(selector, title) {
            return new CanvasJS.Chart(selector,
                {
                    title:{
                        text: title
                    },
                    data: [
                        {
                            type: "line",

                            dataPoints: [
                            ]
                        }
                    ]
                });

        }
        function initNewChart(selector, title) {
            var canvas = document.getElementById(selector),
                ctx = canvas.getContext('2d'),
                startingData = {
                    labels: [1],
                    datasets: [
                        {
                            fillColor: "rgba(220,220,220,0.2)",
                            strokeColor: "rgba(220,220,220,1)",
                            pointColor: "rgba(220,220,220,1)",
                            pointStrokeColor: "#fff",
                            data: [0]
                        }
                    ]
                },
                latestLabel = 1;

            //Reduce the animation steps for demo clarity.
            var chart = new Chart(ctx).Line(startingData, {
                animationSteps: 15,
                scaleOverride : true,
                scaleSteps : 22,
                scaleStepWidth : 15,
                scaleStartValue : 0 });
            return {'latestLabel' : latestLabel, 'chart' : chart};
        }
        function initHighchart(selector, title) {
            let chart = Highcharts.chart(selector, {
                yAxis: {
                    title: {
                        text: title
                    },
                    max: 320,
                    min: 0,
                },
                series: [{
                    data: []
                }]

            });
            for (var i = 0; i <= 20; i++) {
                chart.series[0].addPoint(0, false);
            };
            return chart;
        }
        // Funktion welche die Nchrichten an das Log anfügt
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

        function updateDistanceView(selector,chart, value) {
            updateProgressBar(selector, value , 'cm', progressBarLevelsSensors);
            //updateSensorChart(chart, value);
            updatehighcharts(chart, value);
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

        function updateSensorChart(selector, data) {
            selector.render();
            var d = new Date();
            var n = d.getTime();
            selector.data[0].addTo('dataPoints', {x: d, y: Math.round(data)});
            if (selector.data[0]['dataPoints'].length > 100) {
                selector.data[0]['dataPoints'].shift();
            }
        }
        function updateNewSensorChart(chart, data) {
            let value = data;
            chart.latestLabel = chart.latestLabel + 1;
            //console.log(chart);
            chart.chart.addData([value], chart.latestLabel);
            if (chart.latestLabel > 10) {
                chart.chart.removeData();
            }
        }
        function updatehighcharts (chart, data) {
            chart.series[0].addPoint(Math.round(data), true, true, false);
        }
    }

    connect();

});