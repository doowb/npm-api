/*!
 * npm-api <https://github.com/doowb/npm-api>
 *
 * Copyright (c) 2016, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var url = require('url');
var utils = require('./utils');
var config = require('./config');

function List (name, view) {
  if (!(this instanceof List)) {
    return new List(name, view);
  }
  this.name = name;
  this.view = view;
  this.config = utils.clone(config);
  this.config.pathname += '/_list/' + this.view.name + '/' + this.name;
}

List.prototype.query = function(params) {
  params = params || {};

  return utils.co(function* (self) {
    return yield new Promise(function(resolve, reject) {
      utils.request(this.url(params), function (err, response, body) {
        if (err) return reject(err);
        var res = {};
        try {
          res = JSON.parse(body);
          return resolve(res);
        } catch (err) {
          return reject(err);
        }
      });
    });
  }, this);
};

List.prototype.url = function(params) {
  return url.format(utils.merge({}, this.config, {query: params || {}}));
};

module.exports = List;
