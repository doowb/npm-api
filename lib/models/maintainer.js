/*!
 * npm-info <https://github.com/doowb/npm-info>
 *
 * Copyright (c) 2016, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var Base = require('./base');

function Maintainer (name) {
  if (!(this instanceof Maintainer)) {
    return new Maintainer(name);
  }
  Base.call(this);
  this.name = name;
}

Base.extend(Maintainer);

Maintainer.prototype.repos = function(cb) {
  if (this.cache.repos) {
    return cb(null, this.cache.repos);
  }

  var self = this;
  var view = new this.View('byUser');
  view.query({key: JSON.stringify(this.name)}, function (err, results) {
    if (err) return cb(err);
    try {
      self.cache.repos = results.map(function (repo) {
        return repo.value;
      });
      cb(null, self.cache.repos);
    } catch (err) {
      cb(err);
    }
  });
};

module.exports = Maintainer;
