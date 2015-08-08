"use strict";

function EventQueue() {
    this._eventCallbacks = [];
    stoppedState();
}

function stoppedState() {
    EventQueue.prototype.push = function(eventCallback) {
        this._eventCallbacks.push(eventCallback);
        runningState();
        while (this._eventCallbacks.length > 0) {
            this._eventCallbacks[0]();
            this._eventCallbacks.splice(0, 1);
        }
        stoppedState();
    };
}

function runningState() {
    EventQueue.prototype.push = function(eventCallback) {
        this._eventCallbacks.push(eventCallback);
    };
}


module.exports = new EventQueue();
