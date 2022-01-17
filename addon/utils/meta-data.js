import Ember from 'ember';

const dataKey = Symbol('data');

function getData(obj, s) {
  let m = Ember.meta(obj);
  let data = m[dataKey];

  if (data) {
    return data[s];
  }
}

function setData(obj, s, value) {
  let m = Ember.meta(obj);
  let data = (m[dataKey] = m[dataKey] || {});

  data[s] = value;
}

export default { getData, setData };
