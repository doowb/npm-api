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

/**
 * Repo constructor. Create an instance of an npm repo by repo name.
 *
 * ```js
 * var repo = new Repo('micromatch');
 * ```
 *
 * @param {String} `name` Name of the npm repo to get information about.
 * @param {Object} `store` Optional cache store instance for caching results. Defaults to a memory store.
 * @api public
 */

function Repo (name, store) {
  if (!(this instanceof Repo)) {
    return new Repo(name);
  }
  Base.call(this, store);
  this.is('repo');
  this.name = name;
  this.use(downloads());
}

/**
 * Extend `Base`
 */

Base.extend(Repo);

/**
 * Get the repo's published package.json.
 *
 * ```js
 * repo.package()
 *   .then(function(pkg) {
 *     console.log(pkg);
 *   }, function(err) {
 *     console.error(err);
 *   });
 * ```
 * @return {Promise} Returns the package.json object when promise resolves.
 * @api public
 */

Repo.prototype.package = function(version) {
  return utils.co(function* (self) {
    version = version || 'latest';
    if (!self.has('pkg-' + version)) {
      var registry = new self.Registry();
      var results = yield registry.get(self.name);
      var pkg = version === 'all'
        ? results
        : (results.versions[version] || results.versions[results['dist-tags'][version]]);

      self.set('pkg-' + version, pkg);
    }
    return self.get('pkg-' + version);
  }, this);
};

/**
 * Get the repo's published package.json value for the specified version.
 *
 * ```js
 * repo.version('0.2.0')
 *   .then(function(pkg) {
 *     console.log(pkg);
 *   }, function(err) {
 *     console.error(err);
 *   });
 * ```
 * @param  {String} `version` Specific version to retrieve.
 * @return {Promise} Returns the package.json object for the specified version when promise resolves.
 * @api public
 */

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

/**
 * Get the repo's dependencies for the specified version.
 *
 * ```js
 * repo.dependencies()
 *   .then(function(dependencies) {
 *     console.log(dependencies);
 *   }, function(err) {
 *     console.error(err);
 *   });
 * ```
 * @param  {String} `version` Specific version to retrieve. Defaults to `latest`.
 * @return {Promise} Returns the dependencies object for the specified version when promise resolves.
 * @api public
 */

Repo.prototype.dependencies = function(version) {
  return this.prop('dependencies', version);
};

/**
 * Get the repo's devDependencies for the specified version.
 *
 * ```js
 * repo.devDependencies()
 *   .then(function(devDependencies) {
 *     console.log(devDependencies);
 *   }, function(err) {
 *     console.error(err);
 *   });
 * ```
 * @param  {String} `version` Specific version to retrieve. Defaults to `latest`.
 * @return {Promise} Returns the devDependencies object for the specified version when promise resolves.
 * @api public
 */

Repo.prototype.devDependencies = function(version) {
  return this.prop('devDependencies', version);
};

/**
 * Get the specified property from the repo's package.json for the specified version.
 *
 * ```js
 * repo.prop('author')
 *   .then(function(author) {
 *     console.log(author);
 *   }, function(err) {
 *     console.error(err);
 *   });
 * ```
 * @param  {String} `prop` Name of the property to get.
 * @param  {String} `version` Specific version to retrieve. Defaults to `latest`.
 * @return {Promise} Returns the property for the specified version when promise resolves.
 * @api public
 */

Repo.prototype.prop = function(prop, version) {
  version = version || 'latest';
  return utils.co(function* (self) {
    var pkg = yield self.version(version);
    return pkg[prop];
  }, this);
};

/**
 * Exposes `Repo`
 */

module.exports = Repo;
