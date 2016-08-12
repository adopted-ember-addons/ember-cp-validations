/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import Base from 'ember-cp-validations/validators/base';
import { unwrapProxy } from 'ember-cp-validations/utils/utils';

const {
  assert,
  isEmpty,
  isPresent,
  getProperties
} = Ember;

/**
 *  If `true` validates that the given value is not empty, if `false`, validates that the given value is empty.
 *
 *   #### Options
 *  - `ignoreBlank` (**Boolean**): If true, treats an empty or whitespace string as not present
 *
 *  ```javascript
 *  // Examples
 *  validator('presence', true)
 *  validator('presence', false)
 *  validator('presence', {
 *    presence: true,
 *    message: 'should not be empty'
 *  })
 *
 *  validator('presence', {
 *  	presence: true,
 *    ignoreBlank: true,
 *    message: 'should not be empty or consist only of spaces'
 *  })
 *  ```
 *
 *  @class Presence
 *  @module Validators
 *  @extends Base
 */
export default Base.extend({

  /**
   * Normalized options passed in.
   * ```js
   * validator('presence', true)
   * // Becomes
   * validator('presence', {
   *   presence: true
   * })
   * ```
   *
   * @method buildOptions
   * @param  {Object}     options
   * @param  {Object}     defaultOptions
   * @param  {Object}     globalOptions
   * @return {Object}
   */
  buildOptions(options = {}, defaultOptions = {}, globalOptions = {}) {
    let opts = options;

    if (typeof options === 'boolean') {
      opts = {
        presence: options
      };
    }
    return this._super(opts, defaultOptions, globalOptions);
  },

  validate(value, options, model, attribute) {
    const { presence, ignoreBlank } = getProperties(options, ['presence', 'ignoreBlank']);

    assert(`[ember-cp-validations] [validator:presence] [${attribute}] option 'presence' is required`, !isEmpty(presence));

    if (presence === true && !this._isPresent(value, ignoreBlank)) {
      return this.createErrorMessage('blank', value, options);
    }

    if (presence === false && this._isPresent(value, ignoreBlank)) {
      return this.createErrorMessage('present', value, options);
    }

    return true;
  },

  /**
   * Handle presence of ember proxy based instances
   */
  _isPresent(value, ignoreBlank = false) {
    const v = unwrapProxy(value);
    return ignoreBlank ? isPresent(v) : !isEmpty(v);
  }
});
