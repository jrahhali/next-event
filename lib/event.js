"use strict";

var eventQueue = require("./event-queue");

function Event() {
    this._listeners = [];
}

Event.prototype.addListener = function(context, method) {
    if (context instanceof Function && (method === undefined || method === null)) {
        this._listeners.push({
            context: undefined,
            method: context
        });
        return;
    }

    if (arguments.length > 1 && context instanceof Object && method instanceof Function) {
        this._listeners.push({
            context: context,
            method: method
        });
        return;
    }

    throw new TypeError("Invalid types supplied to method.");
};

Event.prototype.removeListener = function(context, method) {
    if (arguments.length === 0) {
        return;
    }

    var localContext;
    var localMethod;

    if (arguments.length === 1) {
        localContext = undefined;
        localMethod = arguments[0];
    }

    if (arguments.length > 1) {
        localContext = arguments[0];
        localMethod = arguments[1];
    }

    for (var i = 0; i < this._listeners.length; i++) {
        if (this._listeners[i].context === localContext && this._listeners[i].method === localMethod) {
            this._listeners.splice(i, 1);
            break;
        }
    }
};

Event.prototype.removeAllListeners = function() {
    this._listeners = [];
};

Event.prototype.fire = function() {
    var event = this;
    var argumentsForListeners = arguments;

    eventQueue.push(function() {
        for (var i = 0; i < event._listeners.length; i++) {
            var context = event._listeners[i].context;
            var method = event._listeners[i].method;
            method.apply(context, argumentsForListeners);
        }
    });
};

module.exports = Event;
