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
  validate(value) {
    var options = get(this, 'options');
    var model = get(this, 'model');

    if (!isNone(options.on) && !isEqual(value, get(model, options.on))) {
      return this.createErrorMessage('confirmation', options, value, options.on);
    }

    return true;
  }
});
