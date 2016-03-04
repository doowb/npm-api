/*!
 * npm-info <https://github.com/doowb/npm-info>
 *
 * Copyright (c) 2016, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var path = require('path');
var utils = require('../utils');

module.exports = function (options) {
  return function (app) {
    var store = this.store.repo(this.name);
    app.define('total', function(cb) {
      if (this.cache.total) {
        return cb(null, this.cache.total);
      }
      var self = this;
      this.downloads(function (err, results) {
        if (err) return cb(err);
        self.cache.total = utils.stats.calc.total(results);
        cb(null, self.cache.total);
      });
    });

    app.define('last', function(n, cb) {
      var key = 'last-' + n;
      if (this.cache[key]) {
        return cb(null, this.cache[key]);
      }
      var self = this;
      this.downloads(function (err, results) {
        if (err) return cb(err);
        self.cache[key] = utils.stats.calc.last(n, results);
        cb(null, self.cache[key]);
      });
    });

    app.define('downloads', function(start, cb) {
      if (typeof start === 'function') {
        cb = start;
        start = null;
      }
      var end = this.option('end') ?
        utils.moment(this.option('end')) :
        utils.moment.utc().subtract(1, 'days');

      start = start || '1900-01-01';

      var self = this;
      store.get(['last-updated'], function(err, updated) {
        if (err) return cb(err);
        if (updated) {
          start = updated;
        }
        start = utils.moment(start);

        // due to how npm downloads are cached,
        // set last updated to yesterday
        updated = utils.moment.utc()
          .subtract(1, 'days')
          .format('YYYY-MM-DD');

        return store.get(['downloads'], function(err, downloads) {
          if (err) return cb(err);
          if (end.diff(start, 'days') < 1) {
            return cb(null, downloads);
          }

          downloads = downloads || [];
          if (downloads.length > 0) {
            start = downloads[0].day;
          }
          utils.stats.get(start, end, self.name)
            .on('data', function (data) {
              downloads.push(data);
            })
            .on('error', cb)
            .on('end', function () {
              downloads.sort(function(a, b) {
                if (a.day < b.day) return 1;
                if (a.day > b.day) return -1;
                return 0;
              });
              var results = [];
              downloads.forEach(function(download) {
                if (results.filter(function(d) {
                    return d.day === download.day;
                  }).length === 0) {
                  results.push(download);
                }
              });
              store.set(['last-updated'], updated, function(err) {
                if (err) return cb(err);
                store.set(['downloads'], results, function(err) {
                  if (err) return cb(err);
                  cb(null, results);
                });
              });
            });
        });
      });
    });
  };
};
