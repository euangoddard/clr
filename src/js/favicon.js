'use strict';

var each = require('lodash.foreach');


var FAVICON_ID = 'favicon-link';

var IMAGE_TYPE = 'image/png';


var set_favicon = function (colour_name) {
    var link = document.getElementById(FAVICON_ID);
    link.href = create_favion(colour_name);
};


var get_colour_from_name = function (colour_name) {
    var colour_code;
    var colour_selector = '.' + colour_name;
    each(document.styleSheets, function (stylesheet) {
        each(stylesheet.cssRules, function (rule) {
            if (rule.selectorText === colour_selector) {
                colour_code = rule.style.background;
            }
        });
    });
    return colour_code;
};


var create_favion = function (colour_name) {
    var canvas = document.createElement('canvas');
    canvas.setAttribute('width', '32');
    canvas.setAttribute('height', '32');
    var ctx = canvas.getContext('2d');
    ctx.arc(16, 16, 14, 0, 2 * Math.PI);
    ctx.fillStyle = get_colour_from_name(colour_name);
    ctx.fill();
    var data_url = canvas.toDataURL(IMAGE_TYPE);
    return data_url;
};


module.exports = {
    colour: set_favicon
};