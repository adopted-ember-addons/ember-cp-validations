/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import Base from 'ember-cp-validations/validators/base';

const {
  get,
  canInvoke
} = Ember;

export default Base.extend({
  validate(value) {
    if (value) {
      if (canInvoke(value, 'then')) {
        return value.then((model) => {
          return get(model, 'validations');
        });
      } else {
        return get(value, 'validations');
      }
    }

    return true;
  }
});
