import EmberValidator from 'ember-cp-validations/-private/ember-validator';

/**
 *  <i class="fa fa-hand-o-right" aria-hidden="true"></i> [See All Options](#method_validate)
 *
 *  Validates that your attributes have only numeric values.
 *
 *  ## Examples
 *
 *  ```javascript
 *  validator('number') // Simple check if the value is a number
 *  validator('number', {
 *    allowString: true,
 *    integer: true,
 *    gt: 5,
 *    lte: 100
 *  })
 *  ```
 *
 *  @class Number
 *  @module Validators
 *  @extends Base
 */
export default class ValidatorsNumber extends EmberValidator {
  _evType = 'number';

  static create(props) {
    return new ValidatorsNumber(props);
  }
}
