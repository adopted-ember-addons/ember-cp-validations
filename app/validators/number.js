/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import Base from 'ember-cp-validations/validators/base';

const {
  isEmpty
} = Ember;

export default Base.extend({
  validate(value, options) {
    let numValue = Number(value);
    let optionKeys = Object.keys(options);

    if (typeof value === 'string' && (isEmpty(value) || !options.allowString)) {
      return this.createErrorMessage('notANumber', value, options);
    }

    if (!this.isNumber(numValue)) {
      return this.createErrorMessage('notANumber', value, options);
    }

    if (options.integer && !this.isInteger(numValue)) {
      return this.createErrorMessage('notAnInteger', value, options);
    }

    for (let i = 0; i < optionKeys.length; i++) {
      let type = optionKeys[i];
      let m = this._validateType(type, options, numValue);
      if (typeof m === 'string') {
        return m;
      }
    }

    return true;
  },

  _validateType(type, options, value) {
    let expected = options[type];
    let actual = value;

    if (type === 'is' && actual !== expected) {
      return this.createErrorMessage('equalTo', value, options);
    } else if (type === 'lt' && actual >= expected) {
      return this.createErrorMessage('lessThan', value, options);
    } else if (type === 'lte' && actual > expected) {
      return this.createErrorMessage('lessThanOrEqualTo', value, options);
    } else if (type === 'gt' && actual <= expected) {
      return this.createErrorMessage('greaterThan', value, options);
    } else if (type === 'gte' && actual < expected) {
      return this.createErrorMessage('greaterThanOrEqualTo', value, options);
    } else if (type === 'positive' && actual < 0) {
      return this.createErrorMessage('positive', value, options);
    } else if (type === 'odd' && actual % 2 === 0) {
      return this.createErrorMessage('odd', value, options);
    } else if (type === 'even' && actual % 2 !== 0) {
      return this.createErrorMessage('even', value, options);
    }

    return true;
  },

  /* Use polyfills instead of Number.isNaN or Number.isInteger to support IE & Safari */

  isNumber(value) {
    return typeof value === "number" && !isNaN(value);
  },

  isInteger(value) {
    return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
  }
});
