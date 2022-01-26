import Base from 'ember-cp-validations/validators/base';

/**
 *  Accepts a custom `validate` function.
 *
 *  ## Examples
 *
 *  ```javascript
 *  validator('inline', {
 *    username: 'offirgolan',
 *    validate(value, options, model, attribute) {
 *      return value === options.username ?
 *             true :
 *             `Username must be ${options.username}`;
 *    }
 *  });
 *  ```
 *
 *  @class Inline
 *  @module Validators
 *  @extends Base
 */
export default class ValidatorsInline extends Base {
  validate() {
    return this.options.validate.call(this, ...arguments);
  }

  static create(props) {
    return new ValidatorsInline(props);
  }
}
