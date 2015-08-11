"use strict";

var eventQueue = require("./event-queue");

function Event() {
    this._listeners = [];
}

Event.prototype.add = function(method, object) {
    this._listeners.push({method: method, object: object});
};

Event.prototype.remove = function(method, object) {
    for (var i = 0; i < this._listeners.length; i++) {
        if (this._listeners[i].method === method && this._listeners[i].object === object) {
            this._listeners.splice(i, 1);
            break;
        }
    }
};

Event.prototype.removeAll = function() {
    this._listeners = [];
};

Event.prototype.fire = function() {
    var event = this;
    var listenerArguments = arguments;
    eventQueue.push(function() {
        for (var i = 0; i < event._listeners.length; i++)
            event._listeners[i].method.apply(event._listeners[i].object, listenerArguments);
    });
};

module.exports = Event;
