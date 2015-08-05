"use strict";

var assert = require("assert");
var Event = require("../src/event");

describe("Event", function() {
    describe("addListener()", function() {
        it("should add listeners", function() {
            var event = new Event();
            event.addListener(function(){});
            assert(event._listeners.length === 1);
            event.addListener(function(){});
            assert(event._listeners.length === 2);
        });        
    });
    
    describe("clear()", function() {
        it("should clear the event of all listeners", function() {
            var event = new Event();
            event.addListener(function(){});
            event.clear();
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
        
        it("should finish notifying all listeners before another event notifies theirs", function() {
            var event1 = new Event();
            var event2 = new Event();
            var event3 = new Event();
            var callOrder = "";
            
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
    });
});