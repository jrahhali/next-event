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

        while (eventCallbacks.length > 0) {
            eventCallbacks[0]();
            eventCallbacks.splice(0, 1);
        }

        stop();
    }
}());
