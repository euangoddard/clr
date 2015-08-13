var assign = require('lodash.assign');
var template = require('lodash.template');

var COLOUR_NAMES = ['red', 'pink', 'purple', 'blue', 'green', 'yellow', 'orange', 'brown', 'grey', 'black', 'white'];

var SVG_TEMPLATE = template('<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">');

var CIRCLE_TEMPLATE = template('  <circle r="${r}" cx="${x}" cy="${y}" class="${css_class}"></circle>');

var IMAGE_SIZE = 1000;

var IMAGE_CENTRE = IMAGE_SIZE / 2;


var generate_svg = function () {
	
	var xml_parts = [SVG_TEMPLATE({size: IMAGE_SIZE})];
	
	COLOUR_NAMES.forEach(function (colour_name, index) {
		var circle_centre = get_circle_centre(index);
		var circle_context = assign({r: 50, css_class: colour_name}, circle_centre);
		var circle_xml = CIRCLE_TEMPLATE(circle_context);
		xml_parts.push(circle_xml);
	});
	
	xml_parts.push('</svg>');
	console.log(xml_parts.join('\n'));
};


var get_circle_centre = function (index) {
	var colours_count = COLOUR_NAMES.length;
	var angle = Math.PI * 2 * index / colours_count;
	var x = IMAGE_CENTRE + 0.45 * IMAGE_SIZE * Math.cos(angle);
	var y = IMAGE_CENTRE + 0.45 * IMAGE_SIZE * Math.sin(angle);
	return {x: x, y: y};
};


generate_svg();