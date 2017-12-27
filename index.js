/*!
 * npm-api <https://github.com/doowb/npm-api>
 *
 * Copyright (c) 2015-2017, Brian Woodward.
 * Released under the MIT License.
 */

'use strict';

var Base = require('base').namespace('cache');
var utils = require('./lib/utils');
var List = require('./lib/list');
var View = require('./lib/view');
var Repo = require('./lib/models/repo');
var Maintainer = require('./lib/models/maintainer');
var Memory = require('./lib/stores/memory');

/**
 * NpmApi constructor. Create an instance to work with maintainer and repository information.
 *
 * ```js
 * var npm = new NpmApi();
 * ```
 * @api public
 */

function NpmApi(options) {
  if (!(this instanceof NpmApi)) {
    return new NpmApi(options);
  }
  Base.call(this, null, options);
  this.is('npmapi');

  this.use(utils.plugin());
  this.use(utils.option());

  this.define('List', List);
  this.define('View', View);
  this.define('Repo', Repo);
  this.define('Maintainer', Maintainer);

  var store = typeof this.options.store === 'undefined' ? new Memory() : this.options.store;
  this.define('store', store);
}

/**
 * Extend `Base`
 */

Base.extend(NpmApi);

/**
 * Create a new instance of `View` or get an existing instance to work
 * with npm couchdb views.
 *
 * ```js
 * var view = npm.view('byUser');
 * ```
 *
 * @param  {String} `name` Name of the couchdb view to work with.
 * @return {Object} `View` instance
 * @api public
 */

NpmApi.prototype.view = function(name) {
  if (this.has(['views', name])) {
    return this.get(['views', name]);
  }
  var view = new View(name);
  this.set(['views', name], view);
  return view;
};

/**
 * Create a new instance of `List` or get an existing instance to work
 * with npm couchdb list.
 *
 * ```js
 * var list = npm.list('sortCount', 'byUser');
 * ```
 *
 * @param  {String} `name` Name of the couchdb list to work with.
 * @param  {String|Object} `view` Name or instance of a `view` to work with.
 * @return {Object} `List` instance
 * @api public
 */

NpmApi.prototype.list = function(name, view) {
  var viewName = view;
  if (typeof view === 'object') {
    viewName = view.name;
  }

  if (this.has(['lists', viewName, name])) {
    return this.get(['lists', viewName, name]);
  }

  if (typeof view === 'string') {
    view = this.view(view);
  }

  var list = new List(name, view);
  this.set(['lists', viewName, name], list);
  return list;
};

/**
 * Create an instance of a `repo` to work with.
 *
 * ```js
 * var repo =  npm.repo('micromatch');
 * ```
 *
 * @param  {String} `name` Name of the repo as it's published to npm.
 * @return {Object} Instance of a `Repo` model to work with.
 * @api public
 */

NpmApi.prototype.repo = function(name) {
  var escaped = name.split('.').join('\\\\.');
  if (this.has(['repos', escaped])) {
    return this.get(['repos', escaped]);
  }
  var repo = new Repo(name, this.store);
  this.set(['repos', escaped], repo);
  this.run(repo);
  return repo;
};

/**
 * Create an instance of a `maintainer` to work with.
 *
 * ```js
 * var maintainer =  npm.maintainer('doowb');
 * ```
 *
 * @param  {String} `name` Npm username of the maintainer.
 * @return {Object} Instance of a `Maintainer` model to work with.
 * @api public
 */

NpmApi.prototype.maintainer = function(name) {
  if (this.has(['maintainers', name])) {
    return this.get(['maintainers', name]);
  }
  var maintainer = new Maintainer(name, this.store);
  this.set(['maintainers', name], maintainer);
  this.run(maintainer);
  return maintainer;
};

/**
 * Exposes `NpmApi`
 */

module.exports = NpmApi;
