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
    var store = this.store.repo(this.name);
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

        start = start || '1900-01-01';

        var updated = yield store.get(['last-updated']);
        if (updated) {
          start = updated;
        }
        start = utils.moment(start);

        // due to how npm downloads are cached,
        // set last updated to yesterday
        updated = utils.moment.utc()
          .subtract(1, 'days')
          .format('YYYY-MM-DD');

        var downloads = yield store.get(['downloads']);
        if (end.diff(start, 'days') < 1) {
          return downloads;
        }

        downloads = downloads || [];
        if (downloads.length > 0) {
          start = downloads[0].day;
        }

        return yield new Promise(function(resolve, reject) {
          utils.stats.get(start, end, self.name)
            .on('data', function (data) {
              downloads.push(data);
            })
            .on('error', reject)
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
              resolve(utils.co(function* () {
                yield store.set(['last-updated'], updated);
                yield store.set(['downloads'], results);
                return results;
              }));
            });
        });
      }, this);
    });
  };
};
