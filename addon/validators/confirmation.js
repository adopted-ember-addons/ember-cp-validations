/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import EmberValidator from 'ember-cp-validations/-private/ember-validator';

const {
  get,
  assert
} = Ember;

/**
 *  You should use this validator when you have two text fields that should receive exactly the same content.
 *  For example, you may want to confirm an email address or a password. This validator doesn't have to be created on an attribute defined in your model.
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
const Confirmation = EmberValidator.extend({
  _type: 'confirmation'
});

Confirmation.reopenClass({
  getDependentsFor(attribute, options) {
    let on = get(options, 'on');

    assert(`[validator:confirmation] [${attribute}] 'on' must be a string`, typeof on === 'string');

    return on ? [`model.${on}`] : [];
  }
});

export default Confirmation;
