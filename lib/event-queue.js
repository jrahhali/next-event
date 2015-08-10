"use strict";

var Stopped = function() {
    this._state = Running;
    while (this._eventCallbacks.length > 0) {
        this._eventCallbacks[0]();
        this._eventCallbacks.splice(0, 1);
    }
    this._state = Stopped;
};

var Running = function() {};

module.exports = {
    _eventCallbacks: [],
    _state: Stopped,
    push: function(eventCallback) {
        this._eventCallbacks.push(eventCallback);
        this._state.call(this);
    }
};
