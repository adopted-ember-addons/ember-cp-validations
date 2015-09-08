/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import Base from 'ember-cp-validations/validators/base';

const {
  get,
  isEqual
} = Ember;

export default Base.extend({
  validate(value) {
    var options = get(this, 'options');
    var model = get(this, 'model');
    var attribute = get(this, 'attribute');

    if (!isEqual(value, get(model, `${attribute}Confirmation`))) {
      return this.createErrorMessage('confirmation', options, value, attribute);
    }

    return true;
  }
});
