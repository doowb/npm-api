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

/**
 * List constructor. Create an instance of a list associated with a couchdb list in the npm registry.
 *
 * ```js
 * var list = new List('dependedUpon', view);
 * ```
 *
 * @param {String} `name` Name of couchdb list to use.
 * @param {Object} `view` Instance of a View to use with the list.
 * @returns {Object} instance of `List`
 * @api public
 */

function List (name, view) {
  if (!(this instanceof List)) {
    return new List(name, view);
  }
  this.name = name;
  this.view = view;
  this.config = utils.clone(config);
  this.config.pathname += '/_list/' + this.view.name + '/' + this.name;
}

/**
 * Query the couchdb list with the provided parameters.
 *
 * ```js
 * list.query({ key: JSON.stringify(['micromatch']) })
 *   .then(function(results) {
 *     console.log(results);
 *   }, function(err) {
 *     console.log(err);
 *   });
 * ```
 * @param  {Object} `params` URL query parameters to pass along to the couchdb list.
 * @return {Promise} Results of the query when promise is resolved.
 * @api public
 */

List.prototype.query = function(params) {
  params = params || {};

  return utils.co(function* (self) {
    return yield new Promise(function(resolve, reject) {
      utils.request(self.url(params), function (err, response, body) {
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

/**
 * Build a formatted url with the provided parameters.
 *
 * @param  {Object} `params` URL query parameters.
 * @return {String} formatted url string
 * @api public
 */

List.prototype.url = function(params) {
  return url.format(utils.merge({}, this.config, {query: params || {}}));
};

/**
 * Exposes `List`
 */

module.exports = List;
