/**
 * Created by tobias on 16.02.17.
 */
"use strict";

//import {Drone} from '../../main/drone/Drone'
const Drone = require('./Drone.js');

var drone = new Drone(180, false);
drone.run();
