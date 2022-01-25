import Base from 'ember-cp-validations/validators/base';

/**
 *  <i class="fa fa-hand-o-right" aria-hidden="true"></i> [See All Options](#method_validate)
 *
 *  Identifies a `belongs-to` relationship in an Ember Data Model or Ember.Object.
 *  This is used to create a link to the validations object of the child model.
 *
 *  _**Note:** Validations must exist on **both** models/objects_
 *
 *  ### Ember Model
 *
 *  ```javascript
 *  // model/users.js
 *
 *  const Validations = buildValidations({
 *    details: validator('belongs-to')
 *  });
 *
 *  export default DS.Model.extend(Validations, {
 *    'details': DS.belongsTo('user-detail')
 *  });
 *  ```
 *
 *  ```javascript
 *  // model/user-details.js
 *
 *  const Validations = buildValidations({
 *    firstName: validator('presence', true),
 *    lastName: validator('presence', true)
 *  });
 *
 *  export default DS.Model.extend(Validations, {
 *    "firstName": attr('string'),
 *    "lastName": attr('string'),
 *  });
 *  ```
 *
 *  ### Ember Object
 *
 *  ```javascript
 *  // model/users.js
 *
 *  import UserDetails from '../user-details';
 *
 *  const Validations = buildValidations({
 *    details: validator('belongs-to')
 *  });
 *
 *  export default Ember.Object.extend(Validations, {
 *    details: null,
 *
 *    init() {
 *      this._super(...arguments);
 *      let owner = Ember.getOwner(this);
 *      this.set('details', UserDetails.create(owner.ownerInjection()));
 *    }
 *  });
 *  ```
 *
 *  From our `user` model, we can now check any validation property on the `user-details` model.
 *
 *  ```javascript
 *  get(model, 'validations.attrs.details.isValid')
 *  get(model, 'validations.attrs.details.messages')
 *  ```
 *
 *  @class Belongs To
 *  @module Validators
 *  @extends Base
 */
export default class ValidatorsBelongsTo extends Base {
  validate(value) {
    if (value) {
      return value.validations;
    }

    return true;
  }

  static create(props) {
    return new ValidatorsBelongsTo(props);
  }
}
