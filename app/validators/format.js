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
 *    allowBlank: true
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
    email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    // phone: /^([\+]?1\s*[-\/\.]?\s*)?(\((\d{3})\)|(\d{3}))\s*[-\/\.]?\s*(\d{3})\s*[-\/\.]?\s*(\d{4})\s*(([xX]|[eE][xX][tT]?[\.]?|extension)\s*([#*\d]+))*$/,
    url: /(?:([A-Za-z]+):)?(\/{0,3})[a-zA-Z0-9][a-zA-Z-0-9]*(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-{}]*[\w@?^=%&amp;\/~+#-{}])??/,
  },

  countyPhoneRegularExpressions: {
    '+1': { // NANP
      local: /(^([\+]?1\s*[-\/\.]?\s*)?(\((\d{3})\)|(\d{3}))\s*[-\/\.]?\s*(\d{3})\s*[-\/\.]?\s*(\d{4})\s*(([xX]|[eE][xX][tT]?[\.]?|extension)\s*([#*\d]+))*$)/,
      international: /(^([\+]1\s*[-\/\.]?\s*)(\((\d{3})\)|(\d{3}))\s*[-\/\.]?\s*(\d{3})\s*[-\/\.]?\s*(\d{4})\s*(([xX]|[eE][xX][tT]?[\.]?|extension)\s*([#*\d]+))*$)/,
    },
    '+41': { // Switzerland
      local: /(^0([1-9])([0-9]|[0-9] [0-9])*$)/,
      international: /(^\+41 ?(\(0\) ?)?([1-9])([0-9]|[0-9 ][0-9])*$)/,
    },
    '+49': { // Germany
      local: /(^0([1-9])([0-9]|[0-9] [0-9])*$)/,
      international: /(^\+49 ?(\(0\) ?)?([1-9])([0-9]|[0-9 ][0-9])*$)/,
    },
  },

  buildOptions(options = {}, defaultOptions = {}) {
    var regularExpressions = get(this, 'regularExpressions');

    if (options.type && !isNone(regularExpressions[options.type]) && isNone(options.regex)) {
      options.regex = regularExpressions[options.type];
    }

    if(options.type === 'phone' && isNone(options.regex)) {
      let regExArr = [];
      let defaultCountryCode = options.defaultCountryCode || options.defaultCountryCode !== null && '+1' || null;
      let countyPhoneRegularExpressions = get(this, 'countyPhoneRegularExpressions');
      if(defaultCountryCode) {
        regExArr.push(countyPhoneRegularExpressions[defaultCountryCode].local);
      }
      Object.keys(countyPhoneRegularExpressions).forEach(key => {
        regExArr.push(countyPhoneRegularExpressions[key].international);
      });

      options.regex = new RegExp(regExArr.map(r => r.toString()).map(str => str.substr(1, str.length-2)).join('|'));
    }

    return this._super(options, defaultOptions);
  },

  validate(value, options) {
    if (isEmpty(Object.keys(options))) {
      return true;
    }

    if (options.allowBlank && isEmpty(value)) {
      return true;
    }

    if (options.regex && !options.regex.test(value)) {
      if (options.type) {
        return this.createErrorMessage(options.type, value, options);
      }
      return this.createErrorMessage('invalid', value, options);
    }

    return true;
  }
});
