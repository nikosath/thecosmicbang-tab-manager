/**
 * Returns an object, with main() as the only public method (Revealing Module
 * Pattern).
 * @requires FuncScheduler.js
 * @requires TabManager.js
 * @return {Object}
 */
var ex1 = (function () {
  'use strict';

  // Test cases.
  var URLS = ['http://1/', 'http://2/', 'http://3/', 'http://4/', 'http://5/', 'http://6/'];
  // var URLS = ['http://1/', 'http://2/'];
  // var URLS = ['http://1/'];
  // var URLS = ['https://www.google.com', 'http://www.nationalgeographic.com', 'http://cnn.com', 'https://www.zsl.org', 'http://www.telegraph.co.uk/', 'http://www.go2africa.com/', 'http://www.animalplanet.com/', 'http://www.theguardian.com/', 'http://travel.usnews.com/', 'http://www.independent.co.uk/'];

  // Time delays before each phase or action (milliseconds).
  var INITIAL_DELAY = 5000;
  var CLOSING_PHASE_DELAY = 5000;
  var SINGLE_OPENING_DELAY = 2000;
  var SINGLE_CLOSING_DELAY = 2000;

  /**
   * Returns an array of all the currently open tabs in the following order:
   * first the even positioned windows (the 2nd, the 4th, the 6th, the 8th and
   * the 10th) and then the odd positioned windows (the 1st, the 3rd, the 5th,
   * the 7th and the 9th).
   * @return {Window[]}
   */
  function selectEvenOddTabs() {
    var evenTabs = tabs.filter(function (tab, idx) {
      // TabManager's instance is 0 index based. So, we actually need to select
      // the odd indices.
      return idx % 2 !== 0;
    });
    // And here we need to select the even indices.
    var oddTabs = tabs.filter(function (tab, idx) {
      return idx % 2 === 0;
    });
    return evenTabs.concat(oddTabs);
  }

  /**
   * Schedules the closings of the selected tabs, with SINGLE_CLOSING_DELAY, in
   * between each closing. Then it schedules prompting the user for starting a
   * new phase of openings and closings.
   */
  function closeTabs() {
    tabs.closeMany(selectEvenOddTabs(), SINGLE_CLOSING_DELAY);
    scheduler.addFunc(function () {
      if (window.confirm('Start again?')) {
        main();
      }
    }, 0);
  }

  /**
   * Schedules the openings of the selected tabs with SINGLE_OPENING_DELAY,
   * in between each opening. Then it schedules the closing phase.
   */
  function openTabsCloseTabs() {
    tabs.openMany(URLS, SINGLE_OPENING_DELAY);
    scheduler.addFunc(closeTabs, CLOSING_PHASE_DELAY);
  }

  // Our function scheduler.
  var scheduler = new FuncScheduler();
  // It will hold and help us manage, all the tabs we open.
  var tabs = new TabManager(scheduler);
  function main() {
    // We begin by scheduling a new phase of openings and closings.
    scheduler.addFunc(openTabsCloseTabs, INITIAL_DELAY);
  }

  return {
    main: main
  };
})();
