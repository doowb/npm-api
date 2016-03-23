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

Firebase.prototype.get = function(key) {
  var self = this;
  return new Promise(function(resolve, reject) {
    key = utils.arrayify(key).join('/').split('.').join('-');
    self.ref.child(key).once('value', function(snapshot) {
      resolve(snapshot.val());
    });
  });
};

Firebase.prototype.set = function(key, val) {
  var self = this;
  return new Promise(function(resolve, reject) {
    key = utils.arrayify(key).join('/').split('.').join('-');
    self.ref.child(key).set(val, resolve);
  });
};


module.exports = Firebase;
