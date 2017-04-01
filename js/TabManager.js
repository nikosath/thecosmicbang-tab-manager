/**
* @classdesc Tab manager. More specifically, a grouping of tabs that we can
*  manage. The tabs we open get added to an instance of this class, and those we close, get removed.
*  We can open/close multiple tabs, with a specified
*  delay in between every single opening/closing.
* @requires FuncScheduler.js
* @requires NkaUtils.js
* @param {FuncScheduler} [scheduler] - A scheduler for the tab openings/closings
* @constructor
*/
function TabManager(scheduler) {
  'use strict';

  /**
   * Holds all the windows/tabs we open.
   * @property {Array}
   */
  this.openTabs = [];
  /**
   * The scheduler for the tab openings/closings.
   * @property {FuncScheduler}
   */
  this.scheduler = (scheduler === undefined) ? new FuncScheduler() : scheduler;
}

// TabManager's instance methods.
TabManager.prototype = {
  // This is a JavaScript convention.
  constructor: TabManager,
  /**
   * Opens a new tab and adds it to the others.
   * @param  {string} url
   */
  open: function (url) {
    console.log(NkaUtils.time() + ' open tab ' + url);
    this.openTabs.push(window.open(url));
  },
  /**
   * Returns the number of open tabs.
   */
  length: function () {
    return this.openTabs.length;
  },
  /**
   * Returns all the tabs that satisfy the given condition.
   * @param  {Function} condition A function that takes a tab (Window)
   * and its index. It must return true ot false.
   * @return {Window[]}
   */
  filter: function (condition) {
    var filteredTabs = [];
    this.openTabs.forEach(function (tab, idx) {
      if (condition(tab, idx)) {
        filteredTabs.push(tab);
      }
    });
    return filteredTabs;
  },
  /**
   * Schedules the openings of tabs/urls.
   * @param  {string[]} urls
   * @param  {number} delay - The delay in between each tab opening.
   */
  openMany: function (urls, delay) {
    delay = (delay === undefined) ? 0 : delay;
    // Open the first one with 0 delay.
    this.scheduler.addFunc(this.open, 0, this, urls[0]);
    for (var i = 1; i < urls.length; i++) {
      this.scheduler.addFunc(this.open, delay, this, urls[i]);
    }
  },
  // Removes the closed tabs, from our group with the open ones.
  removeClosedTabs: function () {
    // Inside the callback function, 'this' refers to the global object, so we
    //  need to save it.
    var self = this;
    self.openTabs.forEach(function (tab, idx) {
      if (tab.closed) {
        self.openTabs.splice(idx, 1);
      }
    });
  },
  /**
   * Schedules the closings of open tabs.
   * @param  {Window[]} tabs
   * @param  {number} delay - The delay in between each tab closing.
   */
  closeMany: function (tabs, delay) {
    delay = (delay === undefined) ? 0 : delay;
    // Close the first one with 0 delay.
    this.scheduler.addFunc(tabs[0].close, 0, tabs[0]);
    for (var j = 1; j < tabs.length; j++) {
      this.scheduler.addFunc(tabs[j].close, delay, tabs[j]);
    }
    // Remove the tabs that we closed, from our group with the open ones.
    this.scheduler.addFunc(this.removeClosedTabs, 0, this);
  }

};
