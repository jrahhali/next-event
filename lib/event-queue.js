"use strict";

function EventQueue() {
    this.eventCallbacks = [];
    this.state = EventQueue.STOPPED;
}

EventQueue.prototype.push = function(eventCallback) {
    this.eventCallbacks.push(eventCallback);
    this.state.call(this);
};

EventQueue.STOPPED = function() {
    this.state = EventQueue.RUNNING;
    while (this.eventCallbacks.length > 0) {
        this.eventCallbacks[0]();
        this.eventCallbacks.splice(0, 1);
    }
    this.state = EventQueue.STOPPED;
};

EventQueue.RUNNING = function() {};

module.exports = new EventQueue();
