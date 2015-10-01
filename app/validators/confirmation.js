/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import Base from 'ember-cp-validations/validators/base';

const {
  get,
  isEqual,
  isNone
} = Ember;

export default Base.extend({
  validate(value, options, model) {
    if (!isNone(options.on) && !isEqual(value, get(model, options.on))) {
      return this.createErrorMessage('confirmation', value, options);
    }

    return true;
  }
});
