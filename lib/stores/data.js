'use strict';

var path = require('path');
var Base = require('base');
var utils = require('../utils');

// app.use(utils.store(this.name, {cwd: path.resolve(__dirname, '../../.data')}));

function Data(options) {
  if (!(this instanceof Data)) {
    return new Data(options);
  }
  Base.call(this, null, options);
  var opts = utils.merge({cwd: path.resolve(__dirname, '../../.data')}, this.options);
  this.use(utils.store('npm-info', opts));
}

Base.extend(Data);

Data.prototype.get = function(key, cb) {
  cb(null, this.store.get(key));
};

Data.prototype.set = function(key, val, cb) {
  cb(null, this.store.set(key, val));
};


module.exports = Data;
