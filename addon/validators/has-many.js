import Base from 'ember-cp-validations/validators/base';

/**
 *  <i class="fa fa-hand-o-right" aria-hidden="true"></i> [See All Options](#method_validate)
 *
 *  Identifies a `has-many` relationship in an Ember Data Model or Ember.Object.
 *  This is used to create a validation collection of the `has-many` validations.
 *
 *  _**Note:** Validations must exist on **all** models/objects_
 *
 *  ### Ember Models
 *
 *  ```javascript
 *  // model/users.js
 *
 *  const Validations = buildValidations({
 *    friends: validator('has-many')
 *  });
 *
 *  export default DS.Model.extend(Validations, {
 *    friends: DS.hasMany('user')
 *  });
 *  ```
 *
 *  ### Ember Objects
 *
 *  ```javascript
 *  // model/users.js
 *
 *  const Validations = buildValidations({
 *    friends: validator('has-many')
 *  });
 *
 *  export default Ember.Object.extend(Validations, {
 *    friends: null
 *  });
 *  ```
 *
 *  From our `user` model, we can now check validation properties on the `friends` attribute.
 *
 *  ```javascript
 *  get(model, 'validations.attrs.friends.isValid')
 *  get(model, 'validations.attrs.friends.messages')
 *  ```
 *
 *  @class Has Many
 *  @module Validators
 *  @extends Base
 */
export default class ValidatorsHasMany extends Base {
  validate(value) {
    if (value) {
      return value.map((m) => m.validations);
    }

    return true;
  }

  static create(props) {
    return new ValidatorsHasMany(props);
  }
}
