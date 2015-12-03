/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import Base from 'ember-cp-validations/validators/base';

const {
  get,
  isNone,
  isEmpty
} = Ember;

export default Base.extend({
  validate(value, options) {
    if (isEmpty(Object.keys(options))) {
      return true;
    }

    if (options.allowBlank && isEmpty(value)) {
      return true;
    }

    if (isNone(value)) {
      return true;
    }

    if (!isNone(options.is) && options.is !== get(value, 'length')) {
      return this.createErrorMessage('wrongLength', value, options);
    }

    if (!isNone(options.min) && options.min > get(value, 'length')) {
      return this.createErrorMessage('tooShort', value, options);
    }

    if (!isNone(options.max) && options.max < get(value, 'length')) {
      return this.createErrorMessage('tooLong', value, options);
    }

    return true;
  }
});
