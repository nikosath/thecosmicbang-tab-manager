# A Tab Manager that uses a Function Scheduler
(TheCosmicBang task assignment: Javascript in web browsers)

## What is it?
Class `TabManager` is a... tab manager. More specifically, a grouping of tabs
that we can manage (to a small extent). The tabs we open get added to an
instance of this class, and those we close, get removed. We can open/close
multiple tabs, with a specified delay in between every single opening/closing.

`TabManager` relies on another class, `FuncScheduler`, which is a... function
scheduler. It allows the invocation of a series of functions one after the
other, with a specified delay before each invocation. It utilizes a FIFO queue
for any functions waiting to be scheduled for invocation. Only one function can
be at the scheduled state/slot, at any given time.

## Usage

If you want to see the demo in action, please visit the
[github project page](http://www.nikosath.space/tab-manager/index.html).

#### Class TabManager example
```javascript
var URLS = [
  'https://www.google.com',
  'http://www.nationalgeographic.com',
  'http://cnn.com'];

var OPENING_DELAY = 2000; // 2s delay between each tab opening
var CLOSING_DELAY = 1000; // 1s delay between each tab closing

var tabs = new TabManager();

tabs.openMany(URLS, OPENING_DELAY);

// Select the even positioned tabs. TabManager's instance is 0 index based.
// So, we actually need to select the odd indices.
// (evenTabs is a Array of Window objects)
var evenTabs = tabs.filter(function (tab, idx) {
  // idx is a 0 based index
  return idx % 2 !== 0;
});

tabs.closeMany(evenTabs, CLOSING_DELAY);

```

#### Class FuncScheduler example
```javascript
// In the following example f1, f2, f3, f4 get invoked after 2sec, 7sec, 8sec,
// 9sec respectively. Because, the point in time they will be called depends on
// their position in the queue and the delay attached to them and to the
// functions already in the queue before them.

var scheduler = new FuncScheduler();
var delay1 = 2000; // in milliseconds
var delay2 = 5000;

scheduler.addFunc(function f1 () {
// do stuff
}, delay1);

scheduler.addFunc(function f2 () {
// do even more stuff
}, delay2);

// If we need 'this' inside f3 or f4 to refer to something other than the global
// object, we have to pass 'that' other to addFunc.
var that = this;
scheduler.addFunc(function f3 () {
// do stuff
}, 1000, that);

// If we want to pass a argument to f4 at the time of the invocation, we can do
// so.
var arg = 'Whatever this function expects';
scheduler.addFunc(function f4 () {
// do even more stuff
}, 1000, that, arg);
```

## The problem that led to all of this

After an initial delay of 5sec, open a bunch of tabs with a delay of 2sec in
between each opening. Then wait 5sec and start closing those tabs with a 2sec
delay in between each closing. The closing should happen in the following
order: first the even positioned tabs (e.g. the 2nd, the 4th, the 6th, the 8th
and the 10th) and then the odd positioned tabs (e.g. the 1st, the 3rd, the 5th,
the 7th and the 9th). At the end, prompt the user, asking whether a new
phase/circle of openings/closings should begin. Use `setTimeout()` or/and
`setInterval()`.

## My solution

In my analysis, I decided that, for each circle/phase of openings and closings, I had to schedule 3 + (2 * number_of_tabs) events/actions. One after the other with a specified delay in between each event. I think that, if I could use something like a `pause()`, things would be simpler. With the restriction of having to use `setTimeout()` or/and `setInterval()`, I came up with a solution that uses `setTimeout()` to set the first timer, which when it fires, it invokes the first event/action/function that was scheduled, and right after that, it sets the next timer. And this goes on and on, until all functions have been scheduled.

In particular this is the series of events we have to schedule/delay for just one circle/phase:
> Start(Openings(Closing phase(Closings(Start over()))))

For my implementation, I created the two aforementioned classes. Firstly, `TabManager`, that holds all our tabs together as one group, and has methods for opening/closing those tabs with a specified delay in between each action. Secondly, `FuncScheduler`, which `TabManager` relies on, is a quite generic function scheduler, in the sense that it doesn't know anything about tabs, and it can schedule any action whatsoever, as long as, it's in the form a function.

The reasoning for having two separate classes, was that I attemped to minimize the perceived complexity of my solution, and increase the aspects of code reusability and maintainability. Thus, I opted to decouple as much as I could, the process of tab management from the process of scheduling actions.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
