/**
 * Created by raphael on 22.05.17.
 */
const sinon = require('sinon');
const mockery = require('mockery');
const Drone = require('../../main/drone/Drone');
const chai = require('chai');
const assertChai = require('chai').assert;
const expect = require('chai').expect;
const should = require('chai').should;
const assert = require('assert');
const ping = require("net-ping");

const bebop = {
    takeOff: function () {
    },
    stop: function () {
    },
    land: function (callback) {
        callback
    }
}

describe('Drone Control', function () {
    let drone;
    beforeEach(function () {

        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        drone = new Drone(200, false);
        sinon.stub(drone, 'onExit')
    });

    afterEach(function () {
        mockery.disable();
        drone = undefined
    });

    describe('check if testmode can be set', function () {
        it('set the testmode to true', function () {
            let drone = new Drone(10, true);
            assert.equal(drone.config.testMode, true)
        });
        it('set the testmode to false', function () {
            let drone = new Drone(10, false);
            assert.equal(drone.config.testMode, false)
        });
        it('testmode not set. Should be undefined ', function () {
            let drone = new Drone(10);
            assert.equal(drone.config.testMode, undefined)
        })
    });
    describe('check if flighttime can be set', function () {
        it('set flighttime to positive value greater than 0', function () {
            let drone = new Drone(120, false);
            assert.equal(drone.config.flightDurationSec, 120)
        });
        it('set flighttime to negative value', function () {
            assert.throws(function () {
                let drone = new Drone(-120, false)
            }, Error)
        })
    });

    it('should turn off the autopilot', function () {
        let drone = new Drone(100, false);
        assert.equal(drone.state.autoPilot, true);
        drone.setAutoPilot(false);
        assert.equal(drone.state.autoPilot, false)
    });

    describe('check if value update events are emitted', function () {
        it('update a speed value', function (done) {
            let drone = new Drone(100, false);
            drone.eventEmitter.once('webHUD', function (message) {
                try {
                    let msg = JSON.parse(message);
                    if (msg.key === 'forward' && msg.value === 10) {
                        done()
                    }
                } catch (err) {
                    done(err)
                }
            });
            drone.speed.forward = 10

        });
        it('update a state value', function (done) {
            let drone = new Drone(100, false);
            drone.eventEmitter.once('webHUD', function (message) {
                try {
                    let msg = JSON.parse(message);
                    if (msg.key === 'isFlying' && msg.value === true) {
                        done()
                    }
                } catch (err) {
                    done(err)
                }
            });
            drone.state.isFlying = true

        })
    });
    describe('adding the Websocket to the drone', function () {
        it('should work without error', function () {
            let drone = new Drone(100, false);
            assertChai.doesNotThrow(() => {
                drone.addWebsocketServer()
            }, Error);

        })
        // TODO does not work
        /*
         it('adding the websocket twice throws an error', function () {
         let drone = new Drone(100, false)
         assertChai.throws(() => {
         drone.addWebsocketServer()
         drone.addWebsocketServer()
         }, Error);
         })
         */
    });


    describe('adding the http server', function () {
        it('should return code 200', function (done) {
            let drone = new Drone(100, false);
            drone.addHttpServer();
            const request = require('request');
            request('http://localhost:8080/index.html', function (error, response, body) {
                if (error) {
                    done(error)
                } else if (response.statusCode === 200) {
                    done()
                } else {
                    done(new Error(response.statusCode))
                }
            });
        })
    });


    describe('ping the drone', function () {


        it('ping on event', function () {
            sinon.stub(drone, 'pingDrone');
            drone.addEventListeners();
            drone.eventEmitter.emit('ping');
            assert(drone.pingDrone.calledOnce);
        })
    });


    describe('react on Ping result', function () {
        it('with error not flying', function () {
            //sinon.stub(drone.buzzer, 'blink')
            //sinon.stub(drone.led, 'blink')
            drone.reactOnPing(new Error('ping failed'));
            assertChai.equal(drone.state.isWLANConnected, false);
            assertChai.equal(drone.state.isDroneConnected, false);
            assertChai.equal(drone.state.readyForTakeoff, false)
            //assert(drone.buzzer.blink.calledOnce);
            //assert(drone.led.blink.calledOnce);

        });

        it('without error not flying', function (done) {
            drone.eventEmitter.once('pingSuccessful', () => done());
            drone.reactOnPing();
            assertChai.equal(drone.state.isWLANConnected, true);
            assertChai.equal(drone.state.readyForTakeoff, false)

        })

    });

    describe('react on keyboard input', function () {
        after(function () {
            //drone.emergencyLand.restore();
        });
        it('"Enter" should trigger emergency landing', function () {
            sinon.stub(drone, 'emergencyLand');
            drone.initKeyHandler(undefined, {'name': 'return'});
            expect(drone.emergencyLand.calledOnce).to.be.true
        });

        it('"t" should trigger takeoff', function () {
            sinon.stub(drone, 'buttonPushed');
            sinon.stub(drone, 'takeoff');
            drone.initKeyHandler(undefined, {'name': 't'});
            expect(drone.buttonPushed.calledOnce).to.be.true
        })


    });

    describe('#onDroneReady', function () {
        it('drone is ready for takeoff', function (done) {
            sinon.stub(drone, 'checkReady');
            drone.eventEmitter.once('triggerCheckReady', () => {
                "use strict";
                assertChai.equal(drone.state.isDroneConnected, true);
                assertChai.equal(drone.state.readyForTakeoff, true);
                done()
            });
            assertChai.equal(drone.state.isDroneConnected, false);
            assertChai.equal(drone.state.readyForTakeoff, undefined);
            drone.onDroneReady()
        });
        it('drone is not ready for takeoff', function (done) {
            drone.eventEmitter.once('errorOnDroneReady', () => {
                "use strict";
                assertChai.equal(drone.state.isDroneConnected, true);
                assertChai.equal(drone.state.readyForTakeoff, false);
                done()
            });
            drone.state.readyForTakeoff = false;
            drone.onDroneReady()
        })
    });

    describe('#batteryCheck', function () {
        it('should update the battery level', function () {
            drone.batteryCheck(42);
            assertChai.equal(drone.state.batteryLevel, 42)
        });
        it('should land because low battery', function () {
            sinon.stub(drone, 'landing');
            drone.batteryCheck(2);
            expect(drone.landing.calledOnce).to.be.true
        })

    });

    describe('#buttonPushed', function () {
        before(function () {
            this.clock = sinon.useFakeTimers();
        });

        after(function () {
            this.clock.restore();
        });

        it('should trigger takeoff', function (done) {
            sinon.stub(drone, 'triggerBlink');
            sinon.stub(drone, 'takeoff');
            sinon.stub(drone, 'onException');
            drone.state.readyForTakeoff = true;
            drone.state.isFlying = false;
            drone.buttonPushed(done)
            this.clock.tick(3500)
            //
        });

        it('drone not ready for takeoff', function () {
            sinon.stub(drone, 'log');
            drone.buttonPushed();
            expect(drone.log.calledWith("drone is not in ready-for-takeoff state")).to.be.true
        });

        it('drone already flying', function (done) {
            sinon.stub(drone, 'log');
            drone.state.isFlying = true;
            drone.buttonPushed();
            expect(drone.log.calledWith("drone is already flying. take your fingers out of the way!!")).to.be.true;
            done()
        })

    })

    describe('#triggerBlink', function () {
        let led = {
            blink: function () {
            }
        };
        sinon.stub(led)
        it('should blink', function () {
            drone.triggerBlink(led, 10, 100)
            expect(led.blink.calledWith(10, 100)).to.be.true;
        })
        it('catch error', function () {
            let spy = sinon.spy(drone, 'log')
            drone.triggerBlink(drone, 10, 100)
            expect(spy.calledWith('Error while triggering Blinking: TypeError: obj.blink is not a function')).to.be.true;
        })
    })

    describe('#takeoff', function () {
        beforeEach(function () {
            drone.bebop = bebop
            sinon.spy(drone.bebop, 'takeOff')

        })
        afterEach(function () {
            "use strict";
            drone.bebop.takeOff.restore()
        });
        it('normal start', function () {

            expect(drone.triggerFlightControlId).to.be.equal(-1)
            expect(drone.timeOverId).to.be.equal(-1)

            drone.takeoff()
            expect(drone.triggerFlightControlId).to.be.not.equal(-1)
            expect(drone.timeOverId).to.be.not.equal(-1)
            expect(drone.bebop.takeOff.calledOnce).to.be.true

        })

        it('testmode', function () {
            drone.config.testMode = true

            expect(drone.triggerFlightControlId).to.be.equal(-1)
            expect(drone.timeOverId).to.be.equal(-1)

            drone.takeoff()
            expect(drone.triggerFlightControlId).to.be.not.equal(-1)
            expect(drone.timeOverId).to.be.not.equal(-1)
            expect(drone.bebop.takeOff.called).to.be.false

        })
    })
    describe('#triggerFlightControl', function () {
        before(function () {
            this.clock = sinon.useFakeTimers();
        });

        after(function () {
            this.clock.restore();
        });
        it('trigger flightControl', function () {
            sinon.stub(drone, 'flightControl')
            let interval = drone.config.flightControlInterval
            drone.triggerFlightControl()
            expect(drone.flightControl.called).to.be.false
            this.clock.tick(interval)
            expect(drone.flightControl.calledOnce).to.be.true
            this.clock.tick(interval / 2)
            expect(drone.flightControl.calledOnce).to.be.true
            this.clock.tick(interval / 2)
            expect(drone.flightControl.calledTwice).to.be.true
        })
    })

    describe('#landing', function () {
        beforeEach(function () {
            drone.bebop = bebop
            sinon.stub(drone, 'cleanUpAfterLanding')
            sinon.stub(drone, 'triggerBlink')
            sinon.spy(drone, 'log')
            sinon.spy(drone.bebop, 'stop')
            sinon.spy(drone.bebop, 'land')
        })
        afterEach(function () {
            drone.cleanUpAfterLanding.restore()
            drone.triggerBlink.restore()
            drone.log.restore()
            drone.bebop.stop.restore()
            drone.bebop.land.restore()

        })
        it('land normaly', function () {
            drone.state.isFlying = true

            drone.landing('Unit Test')
            expect(drone.log.calledWith('received landing event: Unit Test')).to.be.true;
            expect(drone.triggerBlink.calledTwice).to.be.true
            expect(drone.bebop.stop.calledOnce).to.be.true
            expect(drone.bebop.land.calledOnce).to.be.true
            expect(drone.cleanUpAfterLanding.calledOnce).to.be.true
        })
        it('do not send signal to bebop in testmode', function () {
            drone.state.isFlying = true
            drone.config.testMode = true
            drone.landing('Unit Test')
            expect(drone.log.calledWith('received landing event: Unit Test')).to.be.true;
            expect(drone.triggerBlink.calledTwice).to.be.true
            expect(drone.bebop.stop.called).to.be.false
            expect(drone.bebop.land.called).to.be.false
            expect(drone.cleanUpAfterLanding.calledOnce).to.be.true

        })
        it('drone not flying', function () {
            drone.state.isFlying = false
            drone.landing('Unit Test')
            expect(drone.bebop.stop.calledOnce).to.be.true
            expect(drone.bebop.land.calledOnce).to.be.true
            expect(drone.cleanUpAfterLanding.calledOnce).to.be.true

        })

    })
    describe('#lockMovement', function () {

        it('should lock movements', function () {
            expect(drone.state.movementLocked).to.be.false
            drone.lockMovement(500)
            expect(drone.state.movementLocked).to.be.true
        })
    })
    describe('#unlockMovement', function () {

        it('should ulock movements', function () {
            drone.state.movementLocked = true
            expect(drone.state.movementLocked).to.be.true
            drone.unlockMovement()
            expect(drone.state.movementLocked).to.be.false
        })
    })
});