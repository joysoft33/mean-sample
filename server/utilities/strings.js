'use strict';

/**
 * Some string tools
 */
export default {

  /**
   * Make every words first letter uppercase in the given string
   */
  capitalizeWords: function (str) {
    return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }
};