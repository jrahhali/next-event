"use strict";

var assert = require("assert");
var Event = require("./../lib/event");

describe("Event", function() {
    describe("addListener()", function() {
        it("addListener() should throw error", function() {
            var event = new Event();
            try {
                event.addListener();
                assert(false);
            }
            catch (err) {
                assert(true);
            }
        });

        it("addListener(instanceof Object) should throw error", function() {
            var event = new Event();
            try {
                event.addListener({});
                assert(false);
            }
            catch (err) {
                assert(true);
            }
        });

        it("addListener(instanceof Function, instanceof Object) should throw error", function() {
            var event = new Event();
            try {
                event.addListener(function(){}, {});
                assert(false);
            }
            catch (err) {
                assert(true);
            }
        });

        it("addListener(instanceof Function, undefined) should be OK", function() {
            var event = new Event();
            try {
                event.addListener(function(){}, undefined);
                assert(true);
            }
            catch (err) {
                assert(false);
            }
        });

        it("addListener(instanceof Function, null) should be OK", function() {
            var event = new Event();
            try {
                event.addListener(function(){}, null);
                assert(true);
            }
            catch (err) {
                assert(false);
            }
        });

        it("addListener(instanceof Function) should be OK", function() {
            var event = new Event();
            try {
                event.addListener(function(){});
                assert(true);
            }
            catch (err) {
                assert(false);
            }
        });

        it("should add listeners", function() {
            var event = new Event();
            event.addListener(function(){});
            event.addListener(function(){});
            assert(event._listeners.length === 2);
        });
    });

    describe("removeListener()", function() {
        it("should remove listeners with no context", function() {
            var event = new Event();
            var listener1 = function() {};
            var listener2 = function() {};
            event.addListener(listener1);
            event.addListener(listener2);
            event.removeListener(listener1);
            assert(event._listeners[0].method === listener2);
        });

        it("should remove listeners added with a context", function() {
            var event = new Event();
            var context = {
                listener1: function() {},
                listener2: function() {}
            };
            event.addListener(context, context.listener1);
            event.addListener(context, context.listener2);
            event.removeListener(context, context.listener1);
            assert(event._listeners[0].context === context && event._listeners[0].method === context.listener2);
        });
    });

    describe("removeAllListeners()", function() {
        it("should remove all listeners", function() {
            var event = new Event();
            event.addListener(function(){});
            event.removeAllListeners();
            assert(event._listeners.length === 0);
        });
    });

    describe("fire()", function() {
        it("should notify listeners in the order they were added", function() {
            var event = new Event();
            var callOrder = "";
            event.addListener(function() { callOrder += "1"; });
            event.addListener(function() { callOrder += "2"; });
            event.fire();
            assert(callOrder === "12");
        });

        it("should fire events in the order that they were triggered", function() {

            var event1 = new Event();
            var event2 = new Event();
            var event3 = new Event();
            var callOrder = "";


            var sender = this;
            event1.addListener(function() {
                callOrder += "1";
                event2.fire();
            });
            event1.addListener(function() {
                 callOrder += "2";
            });
            event2.addListener(function() {
                callOrder += "3";
                event3.fire();
            });
            event2.addListener(function() {
                callOrder += "4";
            });
            event3.addListener(function() {
                callOrder += "5";
            });

            event1.fire();

            assert.equal(callOrder, "12345");
        });

        it("should call listeners with the arguments supplied", function() {
            var event = new Event();
            var sender;
            var data;
            event.addListener(function(param1, param2) {
                sender = param1;
                data = param2;
            });
            event.fire(this, "message");
            assert(sender === this && data === "message");
        });

        it("should call listeners added with a context", function() {
            var event = new Event();
            var output = "";
            function Context() {
                this.firstName = "jamal";
            }
            Context.prototype.outputName = function() { output = this.firstName; };

            event.addListener(new Context(), Context.prototype.outputName);
            event.fire();
            assert(output === "jamal");
        });
    });
});
