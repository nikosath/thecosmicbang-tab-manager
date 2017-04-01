/**
 * @classdesc A function scheduler. It allows the invocation of a series of
 * functions one after the other, with a specified delay before each
 * invocation. It utilizes a FIFO queue for any functions waiting to be
 * scheduled for invocation. Only one function can be at the scheduled
 * state/slot, at any given time.
 * @constructor
 */
function FuncScheduler() {
  'use strict';
  /**
   * Queue of functions waiting to be scheduled.
   * @property {Function[]}
   */
  this.queue = [];
  /**
   * Holds the currently scheduled function and any of its optional accompanying
   * values (i.e. [that] and [arg]).
   * @property {Array}
   */
  this.currentlyScheduled = null;
}

// FuncScheduler's instance methods.
FuncScheduler.prototype = {
  // This is a JavaScript convention.
  constructor: FuncScheduler,

  /**
   * Schedules a function. And right after that function's invocation, it
   * schedules the next function in the queue (by using recursion).
   * @param  {Function} fn - Function to be delayed/scheduled.
   * @param  {number} delay - Time delay before fn's invocation (milliseconds).
   * @param  {Object} [that] - What 'this' will refer to, from inside fn.
   * @param  {} [arg] - Argument that will be passed to fn.
   */
  schedule: function (fn, delay, that, arg) {
    /**
     * By default, the function we pass to setTimeout, has inside of it, 'this',
     * pointing to the global object, so we need to save it.
     * @type {Object}
     */
    var self = this;
    setTimeout(function () {
      /** Nullify currentlyScheduled, because the function that was scheduled,
       * we are currently executing.
       */
      self.currentlyScheduled = null;
      // Check if we were given a 'this' (that) for fn, and use it.
      if (that) {
        fn.call(that, arg);
      } else {
        fn(arg);
      }
      // If there are functions in the queue and there's no function scheduled,
      // then schedule the first/oldest one.
      if (self.queue.length && self.currentlyScheduled === null) {
        var item = self.queue.shift();
        self.schedule(item.fn, item.delay, item.that, item.arg);
      }
    }, delay);
    // Keep track of what we just scheduled with setTimeout.
    self.currentlyScheduled = arguments;
  },

  /**
   * Adds a function in the FIFO queue, waiting for its turn to become
   * scheduled. Or schedules it immediately, if no other function is currently
   * scheduled to run.
   * @param  {Function} fn - Function to be delayed/scheduled.
   * @param  {number} delay - Time delay before fn's invocation (milliseconds).
   * @param  {Object} [that] - What 'this' will refer to, from inside fn.
   * @param  {} [arg] - Argument that will be passed to fn.
   */
  addFunc: function (fn, delay, that, arg) {
    // If there's another function already scheduled, put fn in the queue.
    if (this.currentlyScheduled) {
      this.queue.push({
        fn: fn,
        delay: delay,
        that: that,
        arg: arg
      });
      // Else schedule it right away.
    } else {
      this.schedule(fn, delay, that, arg);
    }
  }
};
