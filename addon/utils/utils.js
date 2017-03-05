/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import requireModule from 'ember-require-module';

const DS = requireModule('ember-data');

const {
  get,
  typeOf,
  isArray,
  canInvoke,
  A: emberArray
} = Ember;

const { isHTMLSafe } = Ember.String;

const assign = Ember.assign || Ember.merge;

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

export function isObject(o) {
  return typeOf(o) === 'object' || typeOf(o) === 'instance';
}

export function isDescriptor(o) {
  return o && typeof o === 'object' && o.isDescriptor;
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

export function mergeOptions(...options) {
  let o = {};

  for (let i = options.length - 1; i >= 0; i--) {
    let _o = options[i];
    assign(o, isObject(_o) ? _o : {});
  }

  return o;
}
