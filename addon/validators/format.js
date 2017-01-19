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
 *  <i class="fa fa-hand-o-right" aria-hidden="true"></i> [See All Options](#method_validate)
 *
 *  Validate over a predefined or custom regular expression.
 *
 *  ## Examples
 *
 *  ```javascript
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
 *    regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$/,
 *    message: 'Password must include at least one upper case letter, one lower case letter, and a number'
 *  })
 *  ```
 *
 *  If you do not want to use the predefined regex for a specific type, you can do something like this
 *
 *  ```javascript
 *  validator('format', {
 *    type: 'email',
 *    regex: /My Better Email Regexp/
 *  })
 *  ```
 *
 *  This allows you to still keep the email error message but with your own custom regex.
 *
 *  @class Format
 *  @module Validators
 *  @extends Base
 */
export default EmberValidator.extend({
  _evType: 'format',
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
      options.regex = regularExpressions[type];
    }

    return this._super(options, defaultOptions, globalOptions);
  }
});
