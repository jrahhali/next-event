"use strict";

module.exports = (new function() {
    var eventCallbacks = [];
    var that = this;
    changeToStoppedState();
    
    function changeToStoppedState() {
        that.push = function(eventCallback) {
            eventCallbacks.push(eventCallback);
            changeToRunningState();
        };
    }
    
    function changeToRunningState() {
        that.push = function(eventCallback) { 
            eventCallbacks.push(eventCallback); 
        };

        while (queueHasMoreEvents()) {
            fireTheNextEvent();
            thenRemoveItFromTheQueue();
        }

        changeToStoppedState();
        
        function queueHasMoreEvents() { return eventCallbacks.length > 0; }
        function fireTheNextEvent() { eventCallbacks[0](); }
        function thenRemoveItFromTheQueue() { eventCallbacks.splice(0, 1); }
    }
}());