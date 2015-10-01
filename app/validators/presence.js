/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import Base from 'ember-cp-validations/validators/base';

const {
  isEmpty
} = Ember;

export default Base.extend({
  buildOptions(options, defaultOptions) {
    if(typeof options === 'boolean') {
      options = {
        presence: options
      };
    }
    return this._super(options, defaultOptions);
  },

  validate(value, options) {
    if (options.presence === true && isEmpty(value)) {
      return this.createErrorMessage('blank', value, options);
    }

    if(options.presence === false && !isEmpty(value)) {
      return this.createErrorMessage('present', value, options);
    }

    return true;
  }
});
