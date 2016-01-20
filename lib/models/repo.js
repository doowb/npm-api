/*!
 * npm-info <https://github.com/doowb/npm-info>
 *
 * Copyright (c) 2016, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var Base = require('./base');
var downloads = require('../plugins/downloads');

function Repo (name) {
  if (!(this instanceof Repo)) {
    return new Repo(name);
  }
  Base.call(this);
  this.name = name;
  this.option('end', new Date('3000-01-01'));
  this.use(downloads());
}

Base.extend(Repo);

Repo.prototype.package = function(cb) {
  if (this.has('pkg')) {
    return cb(null, this.get('pkg'));
  }

  //https://skimdb.npmjs.com/registry/_design/app/_view/listAll?key=%22assemble%22
  var self = this;
  var view = new this.View('listAll');
  view.query({key: JSON.stringify(this.name)}, function (err, results) {
    if (err) return cb(err);
    try {
      self.set('pkg', results.map(function (pkg) {
        return pkg.value;
      })[0]);
      cb(null, self.get('pkg'));
    } catch (err) {
      cb(err);
    }
  });
};

Repo.prototype.version = function(version, cb) {
  this.package(function(err, pkg) {
    if (err) return cb(err);
    if (pkg['dist-tags'][version]) {
      version = pkg['dist-tags'][version];
    }
    if (!pkg.versions[version]) {
      return cb(null, {});
    }
    return cb(null, pkg.versions[version]);
  });
};

Repo.prototype.dependencies = function(version, cb) {
  this.prop('dependencies', version, cb);
};

Repo.prototype.devDependencies = function(version, cb) {
  this.prop('devDependencies', version, cb);
};

Repo.prototype.prop = function(prop, version, cb) {
  if (typeof version === 'function') {
    cb = version;
    version = 'latest';
  }
  version = version || 'latest';
  this.version(version, function (err, pkg) {
    if (err) return cb(err);
    cb(null, pkg[prop]);
  });
};
module.exports = Repo;
