/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import isHTMLSafe from 'ember-string-ishtmlsafe-polyfill';
import _requireModule from 'ember-validators/utils/require-module';

const DS = requireModule('ember-data');

const {
  get,
  isArray,
  canInvoke,
  A: emberArray
} = Ember;

export function requireModule() {
  return _requireModule(...arguments);
}

export function unwrapString(s) {
  if (isHTMLSafe(s)) {
    return s.toString();
  }

  return s;
}

export function unwrapProxy(o) {
  return isProxy(o) ? unwrapProxy(get(o, 'content')) : o;
}

export function isProxy(o) {
  return !!(o && (o instanceof Ember.ObjectProxy || o instanceof Ember.ArrayProxy));
}

export function isPromise(p) {
  return !!(p && canInvoke(p, 'then'));
}

export function isDsModel(o) {
  return !!(DS && o && o instanceof DS.Model);
}

export function isDSManyArray(o) {
  return !!(DS && o && isArray(o) && (o instanceof DS.PromiseManyArray || o instanceof DS.ManyArray));
}

export function isEmberObject(o) {
  return !!(o && o instanceof Ember.Object);
}

export function isValidatable(value) {
  let v = unwrapProxy(value);
  return isDsModel(v) ? !get(v, 'isDeleted') : true;
}

export function getValidatableValue(value) {
  if (!value) {
    return value;
  }

  if (isDSManyArray(value)) {
    return emberArray(value.filter((v) => isValidatable(v)));
  }

  return isValidatable(value) ? value : undefined;
}
