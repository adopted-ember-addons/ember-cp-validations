/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import EmberValidator from 'ember-cp-validations/-private/ember-validator';
import { regularExpressions } from 'ember-validators/format';

const {
  get,
  isNone
} = Ember;

/**
 *  Validate over a predefined or custom regular expression.
 *
 *   #### Options
 *  - `allowBlank` (**Boolean**): If true, skips validation if the value is empty
 *  - `type` (**String**): Can be the one of the following options [`email`, `phone`, `url`]
 *  - `regex` (**RegExp**): The regular expression to test against
 *  - `allowNonTld` (**Boolean**): If true, the predefined regular expression `email` allows non top-level domains
 *
 *  ```javascript
 *  // Examples
 *  validator('format', {
 *    type: 'email',
 *    allowNonTld: true
 *  })
 *  validator('format', {
 *    allowBlank: true,
 *    type: 'phone'
 *  })
 *  validator('format', {
 *    type: 'url'
 *  })
 *  validator('format', {
 *      regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$/,
 *      message: 'Password must include at least one upper case letter, one lower case letter, and a number'
 *  })
 *  ```
 *
 *  If you do not want to use the predefined regex for a specific type, you can do something like this
 *
 *  ```javascript
 *  // Example
 *  validator('format', {
 *    type: 'email',
 *    regex: /My Better Email Regexp/
 *  })
 *  ```
 *  This allows you to still keep the email error message but with your own custom regex.
 *  @class Format
 *  @module Validators
 *  @extends Base
 */
export default EmberValidator.extend({
  _type: 'format',
  regularExpressions,

  /**
   * Normalized options passed in by applying the desired regex or using the one declared
   *
   * @method buildOptions
   * @param  {Object}     options
   * @param  {Object}     defaultOptions
   * @param  {Object}     globalOptions
   * @return {Object}
   */
  buildOptions(options = {}, defaultOptions = {}, globalOptions = {}) {
    let regularExpressions = get(this, 'regularExpressions');
    let { regex, type } = options;

    if (type && !isNone(regularExpressions[type]) && isNone(regex)) {
      if (type === 'email' && options.allowNonTld) {
        options.regex = regularExpressions.emailOptionalTld;
      } else {
        options.regex = regularExpressions[type];
      }
    }

    return this._super(options, defaultOptions, globalOptions);
  }
});
