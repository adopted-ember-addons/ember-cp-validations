/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';

const DS = requireModule('ember-data');

const {
  get,
  isArray,
  canInvoke,
  A: emberArray
} = Ember;

export function requireModule(module) {
  const rjs = self.requirejs;

  if (
    (rjs.has && rjs.has(module)) ||
    (!rjs.has && (rjs.entries[module] || rjs.entries[module + '/index']))
  ) {
    return self.require(module).default;
  }
}

export function unwrapString(s) {
  if (s && s instanceof Ember.Handlebars.SafeString) {
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
  return !!(o && isArray(o) && (o instanceof DS.PromiseManyArray || o instanceof DS.ManyArray));
}

export function isEmberObject(o) {
  return !!(o && o instanceof Ember.Object);
}

export function isValidatable(value) {
  const v = unwrapProxy(value);
  return isDsModel(v) ? !get(v, 'isDeleted') : true;
}

export function getValidatableValue(value) {
  if(!value) {
    return value;
  }

  if(isDSManyArray(value)) {
    return emberArray(value.filter(v => isValidatable(v)));
  }

  return isValidatable(value) ? value : undefined;
}
