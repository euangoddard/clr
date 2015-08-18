'use strict';

var domready = require('domready');
var each = require('lodash.foreach');
var to_array = require('lodash.toarray');

var speech = require('./speech');

var EVENTS = ['touchstart', 'click'];

domready(function () {
    var circles = document.querySelectorAll('circle');
    each(circles, function (circle) {
        each(EVENTS, function (event_name) {
            circle.addEventListener(event_name, select_circle, false);
        });
        
    });
    speech.language = 'en-GB';
});


var select_circle = function (event) {
    var circle = this;
    var class_list = document.body.classList;
    var colour_name = to_array(circle.classList)[0];
    
    if (class_list.contains(colour_name)) {
        return;
    }
    
    class_list.remove.apply(class_list, to_array(class_list));
    
    class_list.add(colour_name);
    var colour_name_label = document.getElementById('colour-name');
    colour_name_label.textContent = colour_name;
    speech.say(colour_name);
};
