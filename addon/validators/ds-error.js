import EmberValidator from '@eflexsystems/ember-tracked-validations/-private/ember-validator';

/**
 *  <i class="fa fa-hand-o-right" aria-hidden="true"></i> [See All Options](#method_validate)
 *
 *  Creates a link between this library and Ember-Data's [DS.Errors](http://emberjs.com/api/data/classes/DS.Errors.html)
 *  to fetch the latest message for the given attribute.
 *
 *  ## Examples
 *
 *  ```javascript
 *  validator('ds-error')
 *  ```
 *
 *  @class DS Error
 *  @module Validators
 *  @extends Base
 */
export default class ValidatorsDsError extends EmberValidator {
  _evType = 'ds-error';

  static create(props) {
    return new ValidatorsDsError(props);
  }
}
