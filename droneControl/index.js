"use strict";

require("storotype");

var Bebop = require("node-bebop");

module.exports.constants = require("./constants");

module.exports.createClient = function(opts) {
  return new Bebop(opts);
};
