"use strict";

var assert = require("assert");
var Event = require("../src/event");

describe("Event", function() {
    describe("register()", function() {
        it("should add listeners", function() {
            var event = new Event();
            event.register(function(){});
            assert(event._listeners.length === 1);
            event.register(function(){});
            assert(event._listeners.length === 2);
        });        
    });
    
    describe("clear()", function() {
        it("should clear the event of all listeners", function() {
            var event = new Event();
            event.register(function(){});
            event.clear();
            assert(event._listeners.length === 0);
        });
    });
    
    describe("remove()", function() {
        it("should remove the supplied listener", function() {
            var event = new Event();
            var callOrder = "";
            var listener1 = function() { callOrder += "1"; };
            var listener2 = function() { callOrder += "2"; };
            event.register(listener1);
            event.register(listener2);
            event.unregister(listener1);
            event.fire();
            assert.equal(callOrder, "2");
        });
    });
    
    describe("fire()", function() {
        it("should notify listeners in the order they were added", function() {
            var event = new Event();
            var callOrder = "";
            event.register(function() { callOrder += "1"; });
            event.register(function() { callOrder += "2"; });
            event.fire();
            assert(callOrder === "12");
        });
        
        it("should call its listeners with 'sender' and 'data' arguments", function() {
            var event = new Event();
            var sender;
            var data;
            event.register(function() { 
                sender = arguments[0];
                data = arguments[1];
            });
            event.fire("message");
            assert(sender === event && data === "message");
        });        
        
        it("should finish notifying all listeners before another event notifies theirs", function() {
            var event1 = new Event();
            var event2 = new Event();
            var event3 = new Event();
            var callOrder = "";
            
            event1.register(function() {
                callOrder += "1";
                event2.fire();
            });
            event1.register(function() {
                 callOrder += "2";
            });
            event2.register(function() {
                callOrder += "3"; 
                event3.fire();                
            });
            event2.register(function() {
                callOrder += "4"; 
            });
            event3.register(function() {
                callOrder += "5"; 
            });
            
            event1.fire();
            
            assert.equal(callOrder, "12345");
        });        
    });
});