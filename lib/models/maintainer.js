/*!
 * npm-api <https://github.com/doowb/npm-api>
 *
 * Copyright (c) 2016, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var utils = require('../utils');
var Base = require('./base');

/**
 * Maintainer constructor. Create an instance of an npm maintainer by maintainer name.
 *
 * ```js
 * var maintainer = new Maintainer('doowb');
 * ```
 *
 * @param {String} `name` Name of the npm maintainer to get information about.
 * @param {Object} `store` Optional cache store instance for caching results. Defaults to a memory store.
 * @api public
 */

function Maintainer (name, store) {
  if (!(this instanceof Maintainer)) {
    return new Maintainer(name);
  }
  Base.call(this, store);
  this.is('maintainer');
  this.name = name;
}

/**
 * Extend `Base`
 */

Base.extend(Maintainer);

/**
 * Get the repositories owned by this maintainer.
 *
 * ```js
 * maintainer.repos()
 *   .then(function(repos) {
 *     console.log(repos);
 *   }, function(err) {
 *     console.error(err);
 *   });
 * ```
 *
 * @return {Promise} Returns array of repository names when promise resolves.
 * @api public
 */

Maintainer.prototype.repos = function() {
  return utils.co(function* (self) {
    if (!self.cache.repos) {
      var view = new self.View('byUser');
      var results = yield view.query({key: JSON.stringify(self.name)});
      self.cache.repos = results.map(function (repo) {
        return repo.value;
      });
    }
    return self.cache.repos;
  }, this);
};

/**
 * Exposes `Maintainer`
 */

module.exports = Maintainer;
