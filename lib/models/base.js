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
  this.define('store', store);
}

Base.extend(BaseModel);

module.exports = BaseModel;
