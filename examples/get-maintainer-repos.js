'use strict';

var npm = require('../')();
var maintainer = npm.maintainer('doowb');
maintainer.repos(function (err, repos) {
  if (err) return console.error(err);
  console.log(repos);
});
