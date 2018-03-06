/*!
 * npm-api <https://github.com/doowb/npm-api>
 *
 * Copyright (c) 2016, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var path = require('path');
var utils = require('../utils');

module.exports = function (options) {
  return function (app) {

    var log = function() {
      if ((this.options && this.options.verbose === true) ||
          (options && options.verbose === true)) {
        console.log.apply(console, arguments);
      }
    }.bind(this);

    app.define('total', function() {
      return utils.co(function* (self) {
        if (typeof self.cache.total === 'undefined') {
          var results = yield self.downloads();
          self.cache.total = utils.stats.calc.total(results);
        }
        return self.cache.total;
      }, this);
    });

    app.define('last', function(n) {
      return utils.co(function* (self) {
        var key = 'last-' + n;
        if (typeof self.cache[key] === 'undefined') {
          var results = yield self.downloads();
          self.cache[key] = utils.stats.calc.last(n, results);
        }
        return self.cache[key];
      }, this);
    });

    app.define('downloads', function(start) {
      return utils.co(function* (self) {
        var end = self.option('end') ?
          utils.moment(self.option('end')) :
          utils.moment.utc().subtract(1, 'days');

        start = start || '2005-01-01';
        start = utils.moment(start);

        var downloads = [];
        return yield new Promise(function(resolve, reject) {
          log('getting downloads for "' + self.name + '"');
          utils.stats.get(start, end, self.name)
            .on('data', function (data) {
              downloads.push(data);
            })
            .on('error', function(err) {
              log('ERROR: [' + self.name + ']');
              log(err);
            })
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
              resolve(results);
            });
        });
      }, this);
    });
  };
};
