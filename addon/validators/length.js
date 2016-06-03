/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import Base from 'ember-cp-validations/validators/base';

const {
  get,
  isNone,
  isEmpty
} = Ember;

/**
 *  Validates the length of the attributes’ values.
 *
 *   #### Options
 *  - `allowBlank` (**Boolean**): If true, skips validation if the value is empty
 *  - `is` (**Number**): The exact length the value can be
 *  - `min` (**Number**): The minimum length the value can be
 *  - `max` (**Number**): The maximum length the value can be
 *
 *  ```javascript
 *  // Examples
 *  validator('length', {
 *    is: 15
 *  })
 *  validator('length', {
 *      min: 5,
 *      max: 10
 *  })
 *  ```
 *
 *  @class Length
 *  @module Validators
 *  @extends Base
 */
export default Base.extend({
  validate(value, options) {
    if (isEmpty(Object.keys(options))) {
      return true;
    }

    if (options.allowBlank && isEmpty(value)) {
      return true;
    }

    if (isNone(value)) {
      return this.createErrorMessage('blank', value, options);
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
