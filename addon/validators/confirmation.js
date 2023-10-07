import { assert } from '@ember/debug';
import EmberValidator from 'ember-cp-validations/-private/ember-validator';

/**
 *  <i class="fa fa-hand-o-right" aria-hidden="true"></i> [See All Options](#method_validate)
 *
 *  Validates that the attribute has the same value as the one of the declared attribute.
 *
 *  ## Examples
 *
 *  ```javascript
 *  email: validator('format', {
 *    type: 'email'
 *  })
 *  verifiedEmail: validator('confirmation', {
 *    on: 'email',
 *    message: 'Email addresses do not match'
 *  })
 *  ```
 *
 *  @class Confirmation
 *  @module Validators
 *  @extends Base
 */
const Confirmation = EmberValidator.extend({
  _evType: 'confirmation',
});

Confirmation.reopenClass({
  getDependentsFor(attribute, options) {
    let on = options.on;

    assert(
      `[validator:confirmation] [${attribute}] 'on' must be a string`,
      typeof on === 'string',
    );

    return on ? [`model.${on}`] : [];
  },
});

export default Confirmation;
