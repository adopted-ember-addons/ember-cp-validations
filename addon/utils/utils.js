/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';

const {
  canInvoke
} = Ember;

export function requireModule(module) {
  return self.requirejs.has(module) ? self.require(module).default : undefined;
}

export function unwrapString(input) {
  if (input && input instanceof Ember.Handlebars.SafeString) {
    return input.toString();
  }

  return input;
}

export function isPromise(p) {
  return !!(p && canInvoke(p, 'then'));
}
