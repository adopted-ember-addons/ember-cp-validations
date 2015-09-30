/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import Base from 'ember-cp-validations/validators/base';

const {
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

    if (!isNone(options.is) && options.is !== value.length) {
      return this.createErrorMessage('wrongLength', options, value, {
        count: options.is
      });
    }

    if (!isNone(options.min) && options.min > value.length) {
      return this.createErrorMessage('tooShort', options, value, {
        count: options.min
      });
    }

    if (!isNone(options.max) && options.max < value.length) {
      return this.createErrorMessage('tooLong', options, value, {
        count: options.max
      });
    }

    return true;
  }
});
