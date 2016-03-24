/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';

let id = 0;
const dataKey = symbol('data');

function symbol(key) {
  return `_${key}_${new Date().getTime()}_${id++}`;
}

function getData(obj, s) {
  const m = Ember.meta(obj);
  const data = m[dataKey];

  if (data) {
    return data[s];
  }
}

function setData(obj, s, value) {
  const m = Ember.meta(obj);
  const data = m[dataKey] = m[dataKey] || {};

  data[s] = value;
}

export default { symbol, getData, setData };
