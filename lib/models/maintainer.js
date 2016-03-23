/*!
 * npm-api <https://github.com/doowb/npm-api>
 *
 * Copyright (c) 2016, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var utils = require('../utils');
var Base = require('./base');

function Maintainer (name, store) {
  if (!(this instanceof Maintainer)) {
    return new Maintainer(name);
  }
  Base.call(this, store);
  this.is('maintainer');
  this.name = name;
}

Base.extend(Maintainer);

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

module.exports = Maintainer;
