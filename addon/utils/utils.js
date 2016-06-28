/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import require from 'require';

export function hasEmberData() {
  return require.has('ember-data');
}

export function getEmberData() {
  return hasEmberData() ? require('ember-data')['default'] : undefined;
}

export function unwrapString(input) {
  if (input && input instanceof Ember.Handlebars.SafeString) {
    return input.toString();
  }

  return input;
}
