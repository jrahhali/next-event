"use strict";

module.exports = (new function() {
    var eventCallbacks = [];
    var queue = this;
    stop();
    
    function stop() {
        queue.push = function(eventCallback) {
            eventCallbacks.push(eventCallback);
            run();
        };
    }
    
    function run() {
        queue.push = function(eventCallback) { 
            eventCallbacks.push(eventCallback); 
        };

        while (queueHasMoreEvents()) {
            fireTheNextEvent();
            thenRemoveItFromTheQueue();
        }

        stop();
        
        function queueHasMoreEvents() { return eventCallbacks.length > 0; }
        function fireTheNextEvent() { eventCallbacks[0](); }
        function thenRemoveItFromTheQueue() { eventCallbacks.splice(0, 1); }
    }
}());