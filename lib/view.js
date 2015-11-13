'use strict';

var JSONStream = require('JSONStream');
var request = require('request');
var config = require('./config');
var clone = require('clone-deep');
var merge = require('merge-deep');
var url = require('url');

function View (name) {
  if (!(this instanceof View)) {
    return new View(name);
  }
  this.name = name;
  this.config = clone(config);
  this.config.pathname += '/_view/' + this.name;
}

View.prototype.query = function(params, cb) {
  if (typeof params === 'function') {
    cb = params;
    params = {};
  }

  var items = [];
  request(this.url(params))
    .pipe(JSONStream.parse('rows.*'))
    .on('data', function (data) {
      items.push(data);
    })
    .on('error', cb)
    .on('end', function () {
      cb(null, items);
    });
};

View.prototype.url = function(params) {
  return url.format(merge({}, this.config, {query: params || {}}));
};

module.exports = View;