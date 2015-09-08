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
  validate(value) {
    var options = get(this, 'options');
    var model = get(this, 'model');

    if (isNone(options) || isNone(model) || isEmpty(Object.keys(options))) {
      return true;
    }

    if (options.allowBlank && isEmpty(value)) {
      return true;
    }

    if (isEmpty(options.on)) {
      return true;
    }

    var dependentValidations = options.on.map((dependent) => get(model, `validations.attrs.${dependent}`));
    if(!isEmpty(dependentValidations.filter((v) => !get(v, 'isTruelyValid')))) {
      return this.createErrorMessage('invalid', options, value);
    }

    return true;
  }
});
