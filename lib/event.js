"use strict";

var eventQueue = require("./event-queue");

function Event() {
    this._listeners = [];
}

Event.prototype.add = function(listener) {
    if (typeof listener !== "function") {
        throw new TypeError("argument must be of type 'function'");
    }
    
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

Event.prototype.clear = function() {
    this._listeners = [];
};

Event.prototype.fire = function(data) {
    var sender = this;
    eventQueue.push(function() {
        for (var i = 0; i < sender._listeners.length; i++) {
            sender._listeners[i](sender, data);
        } 
    });
};

module.exports = Event;