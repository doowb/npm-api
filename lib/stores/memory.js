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
        get: function(key) {
          return new Promise(function(resolve, reject) {
            resolve(utils.get(store, key));
          });
        },
        set: function(key, val) {
          return new Promise(function(resolve, reject) {
            resolve(utils.set(store, key, val));
          });
        }
      };
    }
  });
  return this[name];
};

Memory.prototype.get = function(key) {
  return new Promise(function(resolve, reject) {
    resolve(this._parent_.get(key));
  });
};

Memory.prototype.set = function(key, val) {
  return new Promise(function(resolve, reject) {
    resolve(this._parent_.set(key, val));
  });
};


module.exports = Memory;
