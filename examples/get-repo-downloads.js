/*!
 * npm-api <https://github.com/doowb/npm-api>
 *
 * Copyright (c) 2016, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var co = require('co');
var npm = require('../')();

var repo = npm.repo('micromatch');
co(function* () {

  var downloads = yield repo.downloads();
  console.log(downloads.length + ' days of downloads have been pulled for ' + repo.name);
  console.log();

  console.log('total:', yield repo.total());
  console.log('last 30 days:', yield repo.last(30));
  console.log('last 7 days:', yield repo.last(7));
  console.log('last day:', yield repo.last(1));

  process.exit();
});
