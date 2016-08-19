/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';

const DS = requireModule('ember-data');

const {
  get,
  canInvoke
} = Ember;

export function requireModule(module) {
  return self.requirejs.has(module) ? self.require(module).default : undefined;
}

export function unwrapString(s) {
  if (s && s instanceof Ember.Handlebars.SafeString) {
    return s.toString();
  }

  return s;
}

export function unwrapProxy(o) {
  if (o && (o instanceof Ember.ObjectProxy || o instanceof Ember.ArrayProxy)) {
    return unwrapProxy(get(o, 'content'));
  }

  return o;
}

export function isDsModel(o) {
  return DS && o && o instanceof DS.Model;
}

export function isEmberObject(o) {
  return o && o instanceof Ember.Object;
}

export function isValidatable(value) {
  const v = unwrapProxy(value);

  if(isDsModel(v)) {
    return !get(v, 'isDeleted');
  }

  return true;
}

export function isPromise(p) {
  return !!(p && canInvoke(p, 'then'));
}
