/*!
 * npm-info <https://github.com/doowb/npm-info>
 *
 * Copyright (c) 2016, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var npm = require('../')();
var repo = npm.repo('micromatch');
repo.downloads(function(err, downloads) {
  if (err) return console.error(err);
  console.log(downloads.length + ' days of downloads have been pulled for micromatch');
  console.log();
  repo.total(function(err, total) {
    if (err) return console.error(err);
    console.log('total:', total);
    repo.last(30, function(err, total) {
      if (err) return console.error(err);
      console.log('last 30 days:', total);
      repo.last(7, function(err, total) {
        if (err) return console.error(err);
        console.log('last 7 days:', total);
        repo.last(1, function(err, total) {
          if (err) return console.error(err);
          console.log('last day:', total);
        });
      });
    });
  });
});
