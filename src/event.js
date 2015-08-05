"use strict";

var eventQueue = (new function() {
    var eventCallbacks = [];
    var that = this;
    stop();
    
    function stop() {
        that.push = function(eventCallback) {
            eventCallbacks.push(eventCallback);
            start();
        };
    }
    
    function start() {
        that.push = function(eventCallback) { 
            eventCallbacks.push(eventCallback); 
        };

        while (queueHasMoreEvents()) {
            fireTheEvent();
            thenRemoveItFromTheQueue();
        }

        stop();
        
        function queueHasMoreEvents() { return eventCallbacks.length > 0; }
        function fireTheEvent() { eventCallbacks[0](); }
        function thenRemoveItFromTheQueue() { eventCallbacks.splice(0, 1); }
    }
}());

function Event() {
    this._listeners = [];
}

Event.prototype.addListener = function(listener) {
    if (typeof listener !== "function")
        throw new TypeError("Actual type: " + typeof listener + ". Expected type: 'function'");
    
    this._listeners.push(listener);
};

Event.prototype.fire = function(data) {
    var that = this;
    eventQueue.push(function() {
        for (var i = 0; i < that._listeners.length; i++) {
            that._listeners[i](that, data);
        } 
    });
};

Event.prototype.clear = function() {
    this._listeners = [];
};

module.exports = Event;