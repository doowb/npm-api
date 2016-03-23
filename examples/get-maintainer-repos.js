/*!
 * npm-api <https://github.com/doowb/npm-api>
 *
 * Copyright (c) 2016, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var npm = require('../')();
var maintainer = npm.maintainer('doowb');
maintainer.repos()
  .then(function (repos) {
    console.log(repos);
  }, function(err) {
    console.error(err);
  });
