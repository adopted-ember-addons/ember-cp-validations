/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import Base from 'ember-cp-validations/validators/base';

const {
  isArray,
} = Ember;

export default Base.extend({
  buildOptions(options, defaultOptions) {
    if(typeof options === 'boolean') {
      options = {
        collection: options
      };
    }
    return this._super(options, defaultOptions);
  },

  validate(value, options) {
    if (options.collection === true && !isArray(value)) {
      return this.createErrorMessage('collection', options, value);
    }

    if (options.collection === false && isArray(value)) {
      return this.createErrorMessage('singular', options, value);
    }

    return true;
  }
});
