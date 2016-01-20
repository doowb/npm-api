'use strict';

var downloads = require('download-stats');
var get = downloads.get;
var calc = downloads.calc;

module.exports = function (options) {
  return function (app) {
    app.define('total', function(cb) {
      if (this.cache.total) {
        return cb(null, this.cache.total);
      }
      var self = this;
      this.downloads(function (err, results) {
        if (err) return cb(err);
        self.cache.total = calc.total(results);
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
        self.cache[key] = calc.last(n, results);
        cb(null, self.cache[key]);
      });
    });

    app.define('downloads', function(start, cb) {
      if (typeof start === 'function') {
        cb = start;
        start = null;
      }
      start = start || '1900-01-01';

      var key = 'downloads-' + start;
      if (this.cache[key]) {
        return cb(null, this.cache[key]);
      }

      var self = this;
      var results = [];
      start = new Date(start);
      get(start, this.option('end'), this.name)
        .on('data', function (data) {
          results.push(data);
        })
        .on('error', cb)
        .on('end', function () {
          self.cache[key] = results;
          cb(null, results);
        });
    });

  };
};
