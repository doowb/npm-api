/*!
 * npm-api <https://github.com/doowb/npm-api>
 *
 * Copyright (c) 2016, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var Base = require('./base');
var utils = require('../utils');
var downloads = require('../plugins/downloads');

function Repo (name, store) {
  if (!(this instanceof Repo)) {
    return new Repo(name);
  }
  Base.call(this, store);
  this.is('repo');
  this.name = name;
  this.use(downloads());
}

Base.extend(Repo);

Repo.prototype.package = function() {
  return utils.co(function* (self) {
    if (!self.has('pkg')) {
      //https://skimdb.npmjs.com/registry/_design/app/_view/listAll?key=%22assemble%22
      var view = new this.View('listAll');
      var results = yield view.query({key: JSON.stringify(this.name)});
      self.set('pkg', results.map(function (pkg) {
        return pkg.value;
      })[0]);
    }
    return self.get('pkg');
  }, this);
};

Repo.prototype.version = function(version) {
  return utils.co(function* (self) {
    var pkg = yield self.package();
    if (pkg['dist-tags'][version]) {
      version = pkg['dist-tags'][version];
    }
    if (!pkg.versions[version]) {
      return {};
    }
    return pkg.versions[version];
  }, this);
};

Repo.prototype.dependencies = function(version) {
  return this.prop('dependencies', version);
};

Repo.prototype.devDependencies = function(version) {
  return this.prop('devDependencies', version);
};

Repo.prototype.prop = function(prop, version) {
  version = version || 'latest';
  return utils.co(function* (self) {
    var pkg = yield self.version(version);
    return pkg[prop];
  }, this);
};

module.exports = Repo;
