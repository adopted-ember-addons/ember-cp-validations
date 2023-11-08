import Base from 'ember-cp-validations/validators/base';
import { isPromise } from 'ember-cp-validations/utils/utils';

/**
 *  <i class="fa fa-hand-o-right" aria-hidden="true"></i> [See All Options](#method_validate)
 *
 *  Identifies a `has-many` relationship in an Ember Data Model or EmberObject.
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
 *  export default Model.extend(Validations, {
 *    friends: hasMany('user')
 *  });
 *  ```
 *
 *  ### Ember Objects
 *
 *  ```javascript
 *  // model/users.js
 *
 *  import EmberObject from '@ember/object';
 *
 *  const Validations = buildValidations({
 *    friends: validator('has-many')
 *  });
 *
 *  export default EmberObject.extend(Validations, {
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
const HasMany = Base.extend({
  validate(value, ...args) {
    if (value) {
      if (isPromise(value)) {
        return value.then((models) => this.validate(models, ...args));
      }

      return value.map((m) => m.validations);
    }

    return true;
  },
});

HasMany.reopenClass({
  getDependentsFor(attribute) {
    /*
      The content.@each.isDeleted must be added for older ember-data versions
     */
    return [
      `model.${attribute}.[]`,
      `model.${attribute}.@each.isDeleted`,
      `model.${attribute}.content.@each.isDeleted`,
      `model.${attribute}.@each.validations`,
      `model.${attribute}.content.@each.validations`,
    ];
  },
});

export default HasMany;
