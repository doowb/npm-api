'use strict';

var path = require('path');
var Base = require('base');
var utils = require('../utils');

// app.use(utils.store(this.name, {cwd: path.resolve(__dirname, '../../.data')}));

function Data(options) {
  if (!(this instanceof Data)) {
    return new Data(options);
  }
  var opts = utils.merge({cwd: path.resolve(__dirname, '../../.data')}, options);
  Base.call(this, null, opts);
  this.define('store', utils.store('npm-api', this.options));
}

Base.extend(Data);

Data.prototype.repo = function(name) {
  var cwd = path.join(path.dirname(this.store.path), this.store.name);
  var store = utils.store(name, { cwd: cwd });
  this.define(name, {
    get: function() {
      return {
        get: function(key, cb) {
          cb(null, store.get(key));
        },
        set: function(key, val, cb) {
          cb(null, store.set(key, val));
        }
      };
    }
  });
  return this[name];
};

Data.prototype.get = function(key, cb) {
  cb(null, this.store.get(key));
};

Data.prototype.set = function(key, val, cb) {
  cb(null, this.store.set(key, val));
};


module.exports = Data;
