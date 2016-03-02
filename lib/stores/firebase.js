'use strict';

var Base = require('base').namespace('cache');
var utils = require('../utils');

function Firebase(ref) {
  if (!(this instanceof Firebase)) {
    return new Firebase(ref);
  }
  Base.call(this);
  this.define('ref', ref);
}

Base.extend(Firebase);

Firebase.prototype.get = function(key, cb) {
  key = utils.arrayify(key).join('/').split('.').join('-');
  this.ref.child(key).once('value', function(snapshot) {
    cb(null, snapshot.val());
  });
};

Firebase.prototype.set = function(key, val, cb) {
  key = utils.arrayify(key).join('/').split('.').join('-');
  this.ref.child(key).set(val, cb);
};


module.exports = Firebase;
