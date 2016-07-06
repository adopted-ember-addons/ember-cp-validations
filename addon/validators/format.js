
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
  assert,
  getProperties
} = Ember;

/**
 *  Validate over a predefined or custom regular expression.
 *
 *   #### Options
 *  - `allowBlank` (**Boolean**): If true, skips validation if the value is empty
 *  - `type` (**String**): Can be the one of the following options [`email`, `phone`, `url`]
 *  - `regex` (**RegExp**): The regular expression to test against
 *
 *  ```javascript
 *  // Examples
 *  validator('format', {
 *    type: 'email'
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
export default Base.extend({
  regularExpressions: {
    email: /^[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
    phone: /^([\+]?1\s*[-\/\.]?\s*)?(\((\d{3})\)|(\d{3}))\s*[-\/\.]?\s*(\d{3})\s*[-\/\.]?\s*(\d{4})\s*(([xX]|[eE][xX][tT]?[\.]?|extension)\s*([#*\d]+))*$/,
    url: /(?:([A-Za-z]+):)?(\/{0,3})[a-zA-Z0-9][a-zA-Z-0-9]*(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-{}]*[\w@?^=%&amp;\/~+#-{}])??/
  },

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
    const regularExpressions = get(this, 'regularExpressions');
    const { regex, type } = options;

    if (type && !isNone(regularExpressions[type]) && isNone(regex)) {
      options.regex = regularExpressions[type];
    }

    return this._super(options, defaultOptions, globalOptions);
  },

  validate(value, options, model, attribute) {
    const { regex, type, allowBlank } = getProperties(options, ['regex', 'type', 'allowBlank']);

    assert(`[ember-cp-validations] [validator:format] [${attribute}] no options were passed in`, !isEmpty(Object.keys(options)));

    if (allowBlank && isEmpty(value)) {
      return true;
    }

    if (regex && !regex.test(value)) {
      return this.createErrorMessage(type || 'invalid', value, options);
    }

    return true;
  }
});
