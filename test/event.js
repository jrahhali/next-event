"use strict";

var assert = require("assert");
var Event = require("./../lib/event");

describe("Event", function() {
    describe("add()", function() {
        it("should add listeners", function() {
            var event = new Event();
            event.add(function(){});
            assert(event._listeners.length === 1);
            event.add(function(){});
            assert(event._listeners.length === 2);
        });
    });

    describe("remove()", function() {
        it("should remove listeners", function() {
            var event = new Event();
            var callOrder = "";
            var listener1 = function() { callOrder += "1"; };
            var listener2 = function() { callOrder += "2"; };
            event.add(listener1);
            event.add(listener2);
            event.remove(listener1);
            event.fire();
            assert.equal(callOrder, "2");
        });
    });

    describe("removeAll()", function() {
        it("should remove all listeners", function() {
            var event = new Event();
            event.add(function(){});
            event.removeAll();
            assert(event._listeners.length === 0);
        });
    });



    describe("fire()", function() {
        it("should notify listeners in the order they were added", function() {
            var event = new Event();
            var callOrder = "";
            event.add(function() { callOrder += "1"; });
            event.add(function() { callOrder += "2"; });
            event.fire();
            assert(callOrder === "12");
        });

        it("should fire events in the order that they were triggered", function() {

            var event1 = new Event();
            var event2 = new Event();
            var event3 = new Event();
            var callOrder = "";


            var sender = this;
            event1.add(function() {
                callOrder += "1";
                event2.fire();
            });
            event1.add(function() {
                 callOrder += "2";
            });
            event2.add(function() {
                callOrder += "3";
                event3.fire();
            });
            event2.add(function() {
                callOrder += "4";
            });
            event3.add(function() {
                callOrder += "5";
            });

            event1.fire();

            assert.equal(callOrder, "12345");
        });

        it("should call listeners with 'sender' and 'data' arguments", function() {
            var event = new Event();
            var sender;
            var data;
            event.add(function() {
                sender = arguments[0];
                data = arguments[1];
            });
            event.fire(this, "message");
            assert(sender === this && data === "message");
        });
    });
});
