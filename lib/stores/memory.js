'use strict';

var Base = require('base').namespace('cache');
var utils = require('../utils');

function Memory(options) {
  if (!(this instanceof Memory)) {
    return new Memory(options);
  }
  Base.call(this, options);
}

Base.extend(Memory);

Memory.prototype.repo = function(name) {
  var store = {};
  this.define(name, {
    get: function() {
      return {
        get: function(key, cb) {
          cb(null, utils.get(store, key));
        },
        set: function(key, val, cb) {
          cb(null, utils.set(store, key, val));
        }
      };
    }
  });
  return this[name];
};

Memory.prototype.get = function(key, cb) {
  cb(null, this._parent_.get(key));
};

Memory.prototype.set = function(key, val, cb) {
  cb(null, this._parent_.set(key, val));
};


module.exports = Memory;
