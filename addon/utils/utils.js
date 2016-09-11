/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';

export function requireModule(module) {
  const rjs = self.requirejs;

  if (
    (rjs.has && rjs.has(module)) ||
    (!rjs.has && (rjs.entries[module] || rjs.entries[module + '/index']))
  ) {
    return self.require(module).default;
  }
}

export function unwrapString(input) {
  if (input && input instanceof Ember.Handlebars.SafeString) {
    return input.toString();
  }

  return input;
}
