/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import Base from 'ember-cp-validations/validators/base';

const {
  canInvoke,
  A: emberArray
} = Ember;

export default Base.extend({
  validate(value) {
    if (value) {
      if (canInvoke(value, 'then')) {
        return value.then((models) => {
          return emberArray(models).getEach('validations');
        });
      } else {
        return value.toArray().getEach('validations');
      }
    }

    return true;
  }
});
