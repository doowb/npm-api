'use strict';

var utils = require('./utils');

var downloads = module.exports = {};

downloads.total = function (arr) {
  var len = arr.length, i = 0;
  var total = 0;
  while (len--) total += arr[i++].downloads || 0;
  return total;
};

downloads.last = function (days, arr) {
  var today = new Date();
  var start = new Date(today);
  start.setUTCDate(start.getUTCDate() - days);
  start = utils.format(start);

  var group = [];
  var len = arr.length, i = 0;
  while (len--) {
    var download = arr[i++];
    if (download.day >= start) {
      group.push(download);
    }
  }
  return downloads.total(group);
};

downloads.prev = function (days, arr) {
  var today = new Date();
  var end = new Date(today);
  end.setUTCDate(end.getUTCDate() - days);
  var start = new Date(end);
  start.setUTCDate(start.getUTCDate() - days);
  end = utils.format(end);
  start = utils.format(start);

  var group = [];
  var len = arr.length, i = 0;
  while (len--) {
    var download = arr[i++];
    if (download.day >= start && download.day < end) {
      group.push(download);
    }
  }
  return downloads.total(group);
};

downloads.group = function (arr, fn) {
  var groups = {};
  var len = arr.length, i = 0;
  while (len--) {
    var download = arr[i++];
    var group = fn(download);
    groups[group] = groups[group] || [];
    groups[group].push(download);
  }
  return groups;
};

downloads.groupTotals = function (groups) {
  var res = {};
  var keys = Object.keys(groups);
  var len = keys.length, i = 0;
  while (len--) {
    var key = keys[i++];
    res[key] = downloads.total(groups[key]);
  }
  return res;
};

downloads.monthly = function (arr) {
  var months = downloads.group(arr, function (download) {
    return download.day.substr(0, 7);
  });
  return downloads.groupTotals(months);
};

downloads.yearly = function (arr) {
  var years = downloads.group(arr, function (download) {
    return download.day.substr(0, 4);
  });
  return downloads.groupTotals(years);
};
