define([

], function() {

  'use strict';

  /*
   * Throttle
   */
  function throttle(fn, time) {
    var last = 0;
    return function() {
      var now = new Date();
      if ((now - last) > time) {
      last = now;

       return fn.apply(this, arguments);
      }
    };
  }

  return {
    throttle: throttle
  };

});
