/*!
 * npm-api <https://github.com/doowb/npm-api>
 *
 * Copyright (c) 2016, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var Base = require('base').namespace('cache');
var utils = require('../utils');
var List = require('../list');
var View = require('../view');
var Registry = require('../registry');
var Memory = require('../stores/memory');

/**
 * Base model to include common plugins.
 *
 * @param {Object} `store` Cache store instance to use.
 * @api public
 */

function BaseModel(store) {
  if (!(this instanceof BaseModel)) {
    return new BaseModel(store);
  }
  Base.call(this);
  this.options = this.options || {};
  this.cache = this.cache || {};
  this.use(utils.option());
  this.use(utils.plugin());

  this.define('List', List);
  this.define('View', View);
  this.define('Registry', Registry);
  this.define('store', store || new Memory());
}

/**
 * Extend `Base`
 */

Base.extend(BaseModel);

/**
 * Exposes `BaseModel`
 */

module.exports = BaseModel;
