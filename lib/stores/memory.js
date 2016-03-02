'use strict';

var Base = require('base').namespace('cache');

function Memory(options) {
  if (!(this instanceof Memory)) {
    return new Memory(options);
  }
  Base.call(this, options);
}

Base.extend(Memory);

Memory.prototype.get = function(key, cb) {
  console.log('getting', key);
  cb(null, this._parent_.get(key));
};

Memory.prototype.set = function(key, val, cb) {
  console.log('setting', key);
  cb(null, this._parent_.set(key, val));
};


module.exports = Memory;
