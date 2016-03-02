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
      var end = utils.moment(this.option('end') || new Date());
      start = start || '1900-01-01';

      var self = this;
      this.store.get(['repos', this.name, 'downloads'], function(err, downloads) {
        if (err) return cb(err);
        downloads = downloads || [];
        if (downloads.length > 0) {
          start = downloads[0].day;
        }
        start = utils.moment(start);
        if (end.diff(start, 'days') <= 1) {
          return cb(null, downloads);
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
          self.store.set(['repos', self.name, 'downloads'], results, function(err) {
            if (err) return cb(err);
            cb(null, results);
          });
        });
      });
    });

  };
};
