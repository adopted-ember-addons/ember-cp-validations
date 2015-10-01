/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import Base from 'ember-cp-validations/validators/base';

const {
  typeOf,
  isEmpty
} = Ember;

export default Base.extend({
  validate(value, options) {
    var array = options['in'];
    var range = options.range;

    if (isEmpty(Object.keys(options))) {
      return true;
    }

    if (options.allowBlank && isEmpty(value)) {
      return true;
    }

    if (array && array.indexOf(value) !== -1) {
      return this.createErrorMessage('exclusion', value, options);
    }

    if (range && range.length === 2) {
      var min = range[0];
      var max = range[1];
      var equalType = typeOf(value) === typeOf(min) && typeOf(value) === typeOf(max);
      if (equalType && min <= value && value <= max) {
        return this.createErrorMessage('exclusion', value, options);
      }
    }

    return true;
  }
});
