"use strict";

function EventQueue() {
    this._eventCallbacks = [];
}

EventQueue.prototype.push = function(eventCallback) {
    this._eventCallbacks.push(eventCallback);

    if (this._eventCallbacks.length > 1)
        return;

    while (this._eventCallbacks.length > 0) {
        this._eventCallbacks[0]();
        this._eventCallbacks.splice(0, 1);
    }
}

module.exports = new EventQueue();
