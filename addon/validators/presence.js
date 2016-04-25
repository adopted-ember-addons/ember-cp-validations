/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import Base from 'ember-cp-validations/validators/base';

const {
  get,
  isEmpty,
  isPresent
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

  validate(value, options) {
    const { presence, ignoreBlank } = options;

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
    if (value instanceof Ember.ObjectProxy || value instanceof Ember.ArrayProxy) {
      return this._isPresent(get(value, 'content'), ignoreBlank);
    }

    if (ignoreBlank) {
      return isPresent(value);
    } else {
      return !isEmpty(value);
    }
  }
});
