/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import Base from 'ember-cp-validations/validators/base';

const {
  get,
  isNone,
  isEmpty,
  getProperties
} = Ember;

/**
 *  Validates the length of the attributes’ values.
 *
 *   #### Options
 *  - `allowNone` (**Boolean**): If true, skips validation if the value is null or undefined. __Default: true__
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
  /**
   * Default allowNone to true
   *
   * @method buildOptions
   * @param  {Object}     options
   * @param  {Object}     defaultOptions
   * @param  {Object}     globalOptions
   * @return {Object}
   */
  buildOptions(options = {}, defaultOptions = {}, globalOptions = {}) {
    options.allowNone = isNone(get(options, 'allowNone')) ? true : get(options, 'allowNone');

    return this._super(options, defaultOptions, globalOptions);
  },

  validate(value, options) {
    const { allowNone, allowBlank, is, min, max } = getProperties(options, [ 'allowNone', 'allowBlank', 'is', 'min', 'max' ]);

    if (isNone(value)) {
      return allowNone ? true : this.createErrorMessage('invalid', value, options);
    }

    const length = get(value, 'length');
    if (allowBlank && isEmpty(value)) {
      return true;
    }

    if (!isNone(is) && is !== length) {
      return this.createErrorMessage('wrongLength', value, options);
    }

    if (!isNone(min) && min > length) {
      return this.createErrorMessage('tooShort', value, options);
    }

    if (!isNone(max) && max < length) {
      return this.createErrorMessage('tooLong', value, options);
    }

    return true;
  }
});
