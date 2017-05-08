'use strict';

let path = require('path');

module.exports = function () {

  var runMode = process.env.NODE_ENV || 'development';
  var settings = {};

  switch (runMode) {
    case 'development':
    case 'production':
      settings = require('../config/env')[runMode];
      break;
  }

  settings.publicPath = path.join(__dirname, 'public');
  settings.runMode = runMode;

  return settings;
}