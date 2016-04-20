/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import Base from './base';

const {
  get,
  isEmpty,
  isPresent
} = Ember;

/**
 *  If `true` validates that the given value is not empty, if `false`, validates that the given value is empty.
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
 *  If you want whitespace to be ignored, use `ignoreWhitespace: true`:
 *
 *  validator('presence', {
 *    ignoreWhitespace: true,
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
    if (options.presence === true && !this._isPresent(value, options.ignoreWhitespace)) {
      return this.createErrorMessage('blank', value, options);
    }

    if (options.presence === false && this._isPresent(value, options.ignoreWhitespace)) {
      return this.createErrorMessage('present', value, options);
    }

    return true;
  },

  /**
   * Handle presence of ember proxy based instances
   */
  _isPresent(value, ignoreWhitespace) {
    if (value instanceof Ember.ObjectProxy || value instanceof Ember.ArrayProxy) {
      return this._isPresent(get(value, 'content'), ignoreWhitespace);
    }

    if (ignoreWhitespace) {
      return isPresent(value);
    } else {
      return !isEmpty(value);
    }
  }
});
