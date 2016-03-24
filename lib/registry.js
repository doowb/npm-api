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
 * Registry constructor. Create an instance of a registry for querying registry.npmjs.org directly.
 *
 * ```js
 * var registry = new Registry();
 * ```
 *
 * @returns {Object} instance of `Registry`
 * @api public
 */

function Registry () {
  if (!(this instanceof Registry)) {
    return new Registry();
  }
  this.config = utils.clone(config);
}

/**
 * Get the package.json for the specified repository.
 *
 * ```js
 * registry.get('micromatch')
 *   .then(function(results) {
 *     console.log(results);
 *   }, function(err) {
 *     console.log(err);
 *   });
 * ```
 * @param  {String} `name` Repository name to get.
 * @return {Promise} Results of the query when promise is resolved.
 * @api public
 */

Registry.prototype.get = function(name) {
  return utils.co(function* (self) {
    return yield new Promise(function(resolve, reject) {
      var pkg = '';
      utils.request.get(self.url(name), function(err, res, body) {
        if (err) return reject(err);
        try {
          var data = JSON.parse(body);
          resolve(data);
        } catch (err) {
          reject(err);
        }
      });
    });
  }, this);
};

/**
 * Build a formatted url
 *
 * @param  {String} `name` Repo name.
 * @return {String} formatted url string
 * @api public
 */

Registry.prototype.url = function(name) {
  return this.config.registry += name;
};

/**
 * Exposes `Registry`
 */

module.exports = Registry;
