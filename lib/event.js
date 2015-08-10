"use strict";

var eventQueue = require("./event-queue");

function Event() {
    this._listeners = [];
}

Event.prototype.add = function(listener) {
    if (typeof listener !== "function")
        throw new TypeError("An instance of Function must be passed in as the listener.");

    this._listeners.push(listener);
};

Event.prototype.remove = function(listener) {
    for (var i = 0; i < this._listeners.length; i++) {
        if (this._listeners[i] === listener) {
            this._listeners.splice(i, 1);
            break;
        }
    }
};

Event.prototype.removeAll = function() {
    this._listeners = [];
};

Event.prototype.fire = function(sender, data) {
    var event = this;
    eventQueue.push(function() {
        for (var i = 0; i < event._listeners.length; i++)
            event._listeners[i](sender, data);
    });
};

module.exports = Event;
