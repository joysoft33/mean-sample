'use strict';

module.exports = {

  capitalizeWords: function (str) {
    return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }
}