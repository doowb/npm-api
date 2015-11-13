'use strict';

var JSONStream = require('JSONStream');
var request = require('request');
var config = require('./config');
var clone = require('clone-deep');
var merge = require('merge-deep');
var url = require('url');

function List (name, view) {
  if (!(this instanceof List)) {
    return new List(name, view);
  }
  this.name = name;
  this.view = view;
  this.config = clone(config);
  this.config.pathname += '/_list/' + this.view.name + '/' + this.name;
}

List.prototype.query = function(params, cb) {
  if (typeof params === 'function') {
    cb = params;
    params = {};
  }

  request(this.url(params), function (err, response, body) {
    if (err) return cb(err);
    var res = {};
    try {
      res = JSON.parse(body);
      return cb(null, res);
    } catch (err) {
      return cb(err);
    }
  });
};

List.prototype.url = function(params) {
  return url.format(merge({}, this.config, {query: params || {}}));
};

module.exports = List;