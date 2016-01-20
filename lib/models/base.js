'use strict';

var Base = require('base').namespace('cache');
var utils = require('../utils');
var List = require('../list');
var View = require('../view');

function BaseModel() {
  if (!(this instanceof BaseModel)) {
    return new BaseModel();
  }
  Base.call(this);
  this.options = this.options || {};
  this.cache = this.cache || {};
  this.use(utils.option());
  this.use(utils.plugin());

  this.define('List', List);
  this.define('View', View);
}

Base.extend(BaseModel);

module.exports = BaseModel;
