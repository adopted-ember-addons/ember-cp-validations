/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import Base from 'ember-cp-validations/validators/base';

const {
  get,
  set,
  isArray,
  typeOf
} = Ember;

export default Base.extend({
  init() {
    var options = get(this, 'options');

    if(typeOf(options) === 'boolean') {
      set(this, 'options', {
        collection: options
      });
    }

    this._super(...arguments);
  },

  validate(value) {
    var options = get(this, 'options');

    if (options.collection === true && !isArray(value)) {
      return this.createErrorMessage('collection', options, value);
    }

    if (options.collection === false && isArray(value)) {
      return this.createErrorMessage('singular', options, value);
    }

    return true;
  }
});
