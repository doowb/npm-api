/*!
 * npm-info <https://github.com/doowb/npm-info>
 *
 * Copyright (c) 2016, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var url = require('url');
var utils = require('./utils');
var config = require('./config');

function View (name) {
  if (!(this instanceof View)) {
    return new View(name);
  }
  this.name = name;
  this.config = utils.clone(config);
  this.config.pathname += '/_view/' + this.name;
}

View.prototype.query = function(params, cb) {
  if (typeof params === 'function') {
    cb = params;
    params = {};
  }

  var items = [];
  utils.request(this.url(params))
    .pipe(utils.JSONStream.parse('rows.*'))
    .on('data', function (data) {
      items.push(data);
    })
    .on('error', cb)
    .on('end', function () {
      cb(null, items);
    });
};

View.prototype.url = function(params) {
  return url.format(utils.merge({}, this.config, {query: params || {}}));
};

module.exports = View;
