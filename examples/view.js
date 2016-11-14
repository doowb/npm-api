'use strict';

var co = require('co');
var npm = require('../')();
var view = npm.view('listAll');

co(function* () {
  var pkg = yield view.query({
    // group_level: 4,
    startkey: JSON.stringify('micromatch'),
    endkey: JSON.stringify('micromatch')
  });
  var val = pkg[0].value;
  var latest = val.versions[val['dist-tags'].latest];
  console.log(latest);
})
