'use strict';

var Base = require('base').namespace('cache');
var plugin = require('base-plugins');
var option = require('base-options');

var List = require('../list');
var View = require('../view');

function BaseModel() {
  if (!(this instanceof BaseModel)) {
    return new BaseModel();
  }
  Base.call(this);
  this.options = this.options || {};
  this.cache = this.cache || {};
  this.use(option());
  this.use(plugin());

  this.define('List', List);
  this.define('View', View);
}

Base.extend(BaseModel);

module.exports = BaseModel;
