var Buffer = require('buffer').Buffer;

var File = require('vinyl');
var assign = require('lodash.assign');
var buffer = require('vinyl-buffer');
var template = require('lodash.template');
var source = require('vinyl-source-stream');


var COLOUR_NAMES = ['red', 'pink', 'purple', 'blue', 'green', 'yellow', 'orange', 'brown', 'grey', 'black', 'white'];

var SVG_TEMPLATE = template('<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">');

var CIRCLE_TEMPLATE = template('  <circle r="${r}" cx="${x}" cy="${y}" class="${css_class}"></circle>');

var IMAGE_SIZE = 1000;

var IMAGE_CENTRE = IMAGE_SIZE / 2;


var generate_svg = function () {
	var svg_xml = generate_svg_content();
	var svg_file = new File({contents: new Buffer(svg_xml)});
	var svg_pipe = svg_file
		.pipe(source('colours.svg'))
		.pipe(buffer())
	return svg_pipe;
};

var generate_svg_content = function () {
	var xml_parts = [SVG_TEMPLATE({size: IMAGE_SIZE})];
	
	COLOUR_NAMES.forEach(function (colour_name, index) {
		var circle_centre = get_circle_centre(index);
		var circle_context = assign({r: 75, css_class: colour_name}, circle_centre);
		var circle_xml = CIRCLE_TEMPLATE(circle_context);
		xml_parts.push(circle_xml);
	});
	
	xml_parts.push('</svg>');
	var xml = xml_parts.join('\n');
	return xml;
};


var get_circle_centre = function (index) {
	var colours_count = COLOUR_NAMES.length;
	var angle = Math.PI * 2 * index / colours_count;
	var centre_displacement = 0.4 * IMAGE_SIZE;
	var x = IMAGE_CENTRE + centre_displacement * Math.cos(angle);
	var y = IMAGE_CENTRE + centre_displacement * Math.sin(angle);
	return {x: x, y: y};
};


module.exports = generate_svg;