/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Base from './base';

/**
 *  Allows the creation of an inline custom validator.
 *
 *  ```javascript
 *  // Examples
 *  validator('inline', function(value, options, model, attribute) { ... })
 *  validator('inline', {
 *    message: '{description} was not valid',
 *    validate: function(value, options, model, attribute) {
 *      // If valid
 *        // return the boolean true
 *
 *      // If invalid
 *        // If the return type is a string, the string returned will be used as the validation message
 *        // If anything else is returned other than a string, the message option will be used
 *    },
 *  })
 *  ```
 *
 *  @class Inline
 *  @module Validators
 *  @extends Base
 */
export default Base.extend({

  /**
   * Normalized options passed in.
   * ```js
   * validator('inline', function(value, options, model, attribute) { ... })
   * // Becomes
   * validator('inline', {
   *   validate: function(value, options, model, attribute) { ... }
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

    if (typeof options === 'function') {
      opts = {
        validate: options
      };
    }
    return this._super(opts, defaultOptions, globalOptions);
  },

  validate(value, options) {
    let result = options.validate.apply(this, arguments);

    if (result === true) {
      return true;
    }

    if (typeof result === 'string') {
      options.message = result;
    }

    return this.createErrorMessage('inline', value, options);;
  }
});
