/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import Base from 'ember-cp-validations/validators/base';

const {
  get,
  isEmpty
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
    if(typeof options === 'boolean') {
      options = {
        presence: options
      };
    }
    return this._super(options, defaultOptions, globalOptions);
  },

  validate(value, options) {
    if (options.presence === true && !this._isPresent(value)) {
      return this.createErrorMessage('blank', value, options);
    }

    if(options.presence === false && this._isPresent(value)) {
      return this.createErrorMessage('present', value, options);
    }

    return true;
  },

  /**
   * Handle presence of ember proxy based instances
   */
  _isPresent(value) {
    if(value instanceof Ember.ObjectProxy || value instanceof Ember.ArrayProxy) {
        return this._isPresent(get(value, 'content'));
    }
    return !isEmpty(value);
  }
});
