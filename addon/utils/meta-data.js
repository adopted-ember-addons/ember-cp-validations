/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';

var id = 0;
var dataKey = symbol('data');

function symbol(key) {
  return `_${key}_${new Date().getTime()}_${id++}`;
}

function getData(obj, symbol) {
  var m = Ember.meta(obj);
  var data = m[dataKey];
  if (data) { return data[symbol]; }
}

function setData(obj, symbol, value) {
  var m = Ember.meta(obj);
  var data = m[dataKey] = m[dataKey] || {};
  data[symbol] = value;
}

export default { symbol, getData, setData };
