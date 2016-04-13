/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import Base from 'ember-cp-validations/validators/base';

const {
  typeOf,
  isEmpty
} = Ember;

/**
 *  Validates that the attributes’ values are included in a given list. All comparisons are done using strict equality so type matters!
 *  For range, the value type is checked against both lower and upper bounds for type equality.
 *
 *   #### Options
 *  - `allowBlank` (**Boolean**): If true, skips validation if the value is empty
 *  - `in` (**Array**): The list of values this attribute could be
 *  - `range` (**Array**): The range in which the attribute's value should reside in
 *
 *  ```javascript
 *  // Examples
 *  validator('inclusion', {
 *      in: ['User', 'Admin']
 *  })
 *  validator('inclusion', {
 *      range: [0, 5] // Must be between 0 (inclusive) to 5 (inclusive)
 *  })
 *  ```
 *
 *  Because of the strict equality comparisons, you can use this validator in many different ways.
 *
 *  ```javascript
 *  // Examples
 *  validator('inclusion', {
 *      in: ['Admin'] // Input must be equal to 'Admin'
 *  })
 *  validator('inclusion', {
 *      range: [0, Infinity] // Input must be positive number
 *  })
 *  validator('inclusion', {
 *      range: [-Infinity, Infinity] // Input must be a number
 *  })
 *  ```
 *
 *  @class Inclusion
 *  @module Validators
 *  @extends Base
 */
export default Base.extend({
  validate(value, options) {
    const array = options.in;
    const range = options.range;

    if (isEmpty(Object.keys(options))) {
      return true;
    }

    if (options.allowBlank && isEmpty(value)) {
      return true;
    }

    if (array && array.indexOf(value) === -1) {
      return this.createErrorMessage('inclusion', value, options);
    }

    if (range && range.length === 2) {
      const min = range[0];
      const max = range[1];
      const equalType = typeOf(value) === typeOf(min) && typeOf(value) === typeOf(max);

      if (!equalType || min > value || value > max) {
        return this.createErrorMessage('inclusion', value, options);
      }
    }

    return true;
  }
});
