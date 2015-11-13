'use strict';

var utils = module.exports = {};

utils.format = function (date) {
	var year = date.getUTCFullYear();
	var month = date.getUTCMonth() + 1;
	var day = date.getUTCDate();

	return '' + year + '-' + utils.pad(month) + '-' + utils.pad(day);
};

utils.pad = function (num) {
	return (num < 10 ? '0' : '') + num;
};

utils.formatNumber = function (num) {
  num = '' + num;
  var len = num.length;
  if (len <= 3) return num;
  var parts = len / 3;
  var i = len % 3;
  var first = '', last = '';
  if (i === 0) {
    i = 3;
  }
  first = num.substr(0, i);
  last = num.substr(i);
  var res = first + ',' + utils.formatNumber(last);
  return res;
};
