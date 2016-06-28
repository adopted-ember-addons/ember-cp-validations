/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import Base from 'ember-cp-validations/validators/base';

const {
  get,
  assert,
  isEqual,
  isEmpty,
} = Ember;

/**
 *  You should use this validator when you have two text fields that should receive exactly the same content.
 *  For example, you may want to confirm an email address or a password. This validator doesnt have to be created on an attribute defined in your model.
 *  This means that when you save your model, in this case, `verfiedEmail` will not be part of the payload.
 *
 *  ```javascript
 *  // Example
 *  email: validator('format', {
 *    type: 'email'
 *  })
 *  verifiedEmail: validator('confirmation', {
 *    on: 'email',
 *    message: 'do not match',
 *    description: 'Email addresses'
 *  })
 *  ```
 *
 *  @class Confirmation
 *  @module Validators
 *  @extends Base
 */
const Confirmation = Base.extend({
  validate(value, options, model, attribute) {
    const on = get(options, 'on');

    assert(`[ember-cp-validations] [validator:confirmation] [${attribute}] option 'on' is required`, !isEmpty(on));

    if (!isEqual(value, get(model, on))) {
      return this.createErrorMessage('confirmation', value, options);
    }

    return true;
  }
});

Confirmation.reopenClass({
  getDependentsFor(attribute, options) {
    const on = get(options, 'on');

    assert(`[ember-cp-validations] [validator:confirmation] [${attribute}] 'on' must be a string`, typeof on === 'string');

    return on ? [ `_model.${on}` ] : [];
  }
});

export default Confirmation;
