/**
 * @fileoverview Utilities mostly for debugging.
 */
var NkaUtils = (function() {
  'use strict';

  function time() {
    var time = new Date();
    return (time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds());
  }

  return {time: time};
}());
