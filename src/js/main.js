'use strict';

var domready = require('domready');
var each = require('lodash.foreach');
var to_array = require('lodash.toarray');

domready(function () {
	var circles = document.querySelectorAll('circle');
	each(circles, function (circle) {
		circle.addEventListener('click', select_circle, false);
	});
});


var select_circle = function (event) {
	var circle = this;
	var class_list = document.body.classList;
	class_list.remove.apply(class_list, to_array(class_list));
	class_list.add.apply(class_list, to_array(circle.classList));
};