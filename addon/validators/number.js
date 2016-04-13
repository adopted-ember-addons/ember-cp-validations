/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import Base from 'ember-cp-validations/validators/base';

const {
  isEmpty
} = Ember;

/**
 *  Validates that your attributes have only numeric values.
 *
 *   #### Options
 *  - `allowBlank` (**Boolean**): If true, skips validation if the value is empty
 *  - `allowString` (**Boolean**): If true, validator will accept string representation of a number
 *  - `integer` (**Boolean**): Number must be an integer
 *  - `positive` (**Boolean**): Number must be greater than 0
 *  - `odd` (**Boolean**): Number must be odd
 *  - `even` (**Boolean**): Number must be even
 *  - `is` (**Number**): Number must be equal to this value
 *  - `lt` (**Number**): Number must be less than this value
 *  - `lte` (**Number**): Number must be less than or equal to this value
 *  - `gt` (**Number**): Number must be greater than this value
 *  - `gte` (**Number**): Number must be greater than or equal to this value
 *
 *  ```javascript
 *  // Examples
 *  validator('number') // Simple check if the value is a number
 *  validator('number', {
 *      allowString: true,
 *      integer: true,
 *      gt: 5,
 *      lte: 100
 *  })
 *  ```
 *
 *  @class Number
 *  @module Validators
 *  @extends Base
 */
export default Base.extend({
  validate(value, options) {
    const numValue = Number(value);
    const optionKeys = Object.keys(options);

    if (options.allowBlank && isEmpty(value)) {
      return true;
    }

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
      const type = optionKeys[i];
      const m = this._validateType(type, options, numValue);

      if (typeof m === 'string') {
        return m;
      }
    }

    return true;
  },

  _validateType(type, options, value) {
    const expected = options[type];
    const actual = value;

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
    return typeof value === 'number' && !isNaN(value);
  },

  isInteger(value) {
    return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
  }
});
