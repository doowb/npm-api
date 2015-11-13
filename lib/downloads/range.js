'use strict';

var request = require('request');
var JSONStream = require('JSONStream');

var utils = require('./utils');

module.exports = function (repo, start, end) {
	var url = 'https://api.npmjs.org/downloads/range/';
	url += utils.format(start);
	url += ':' + utils.format(end);
	url += '/' + repo;

	return request(url)
    .on('error', console.error)
		.pipe(JSONStream.parse('downloads.*'));
}
