/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import Base from 'ember-cp-validations/validators/base';

const {
  get,
  isNone,
  isEmpty
} = Ember;

export default Base.extend({
  regularExpressions: {
    email: /^[_A-Za-z0-9-]+(\.[_A-Za-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/,
    phone: /^([\+]?1\s*[-\/\.]?\s*)?(\((\d{3})\)|(\d{3}))\s*[-\/\.]?\s*(\d{3})\s*[-\/\.]?\s*(\d{4})\s*(([xX]|[eE][xX][tT]?[\.]?|extension)\s*([#*\d]+))*$/,
    url: /(?:([A-Za-z]+):)?(\/{0,3})[a-zA-Z0-9][a-zA-Z-0-9]*(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-{}]*[\w@?^=%&amp;\/~+#-{}])??/,
  },

  init() {
    this._super(...arguments);
    var options = get(this, 'options');
    var regularExpressions = get(this, 'regularExpressions');

    if (options.type && !isNone(regularExpressions[options.type]) && isNone(options.regex)) {
      options.regex = regularExpressions[options.type];
    }
  },

  validate(value) {
    var options = get(this, 'options');

    if (isEmpty(Object.keys(options))) {
      return true;
    }

    if (options.allowBlank && isEmpty(value)) {
      return true;
    }

    if (options.regex && !options.regex.test(value)) {
      if (options.type) {
        return this.createErrorMessage(options.type, options, value);
      }
      return this.createErrorMessage('invalid', options, value);
    }

    return true;
  }
});
