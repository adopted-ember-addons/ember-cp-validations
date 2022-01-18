import EmberValidator from 'ember-cp-validations/-private/ember-validator';

/**
 *  <i class="fa fa-hand-o-right" aria-hidden="true"></i> [See All Options](#method_validate)
 *
 *  Validates the length of the attributes’ values.
 *
 *  ## Examples
 *
 *  ```javascript
 *  validator('length', {
 *    is: 15
 *  })
 *  validator('length', {
 *    min: 5,
 *    max: 10
 *  })
 *  ```
 *
 *  @class Length
 *  @module Validators
 *  @extends Base
 */
export default class ValidatorsLength extends EmberValidator {
  _evType = 'length';

  static create(props) {
    return new ValidatorsLength(props);
  }
}
