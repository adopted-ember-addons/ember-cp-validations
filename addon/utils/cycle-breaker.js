/**
 * Use Ember Meta to break cycles in the CP chains. Lets say we have a User model with a `friends` property that is a hasMany
 * relationship. If we have a user John and he has a friend Jane, that creates a two-way relationship. John is Jane's friends and vise
 * versa. If we were to go down the CP chain and get validations for John's friends, it would go to Jane, then to Jane's friends, which
 * would point back to John. This method tracks which models have been already visited and breaks the cycle.
 */

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

export default function cycleBreaker(fn, value) {
  let key = Symbol('cycle');

  if (getData(this, key)) {
    return value;
  }
  setData(this, key, true);
  try {
    return fn.apply(this, arguments);
  } finally {
    setData(this, key, false);
  }
}
