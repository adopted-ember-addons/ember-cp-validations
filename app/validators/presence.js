/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import Base from 'ember-cp-validations/validators/base';

const {
  get,
  set,
  isEmpty
} = Ember;

export default Base.extend({
  init() {
    var options = get(this, 'options');

    if(typeof options === 'boolean') {
      set(this, 'options', {
        presence: options
      });
    }

    this._super(...arguments);
  },

  validate(value) {
    var options = get(this, 'options');

    if (options.presence === true && isEmpty(value)) {
      return this.createErrorMessage('blank', options, value);
    }

    if(options.presence === false && !isEmpty(value)) {
      return this.createErrorMessage('present', options, value);
    }

    return true;
  }
});
