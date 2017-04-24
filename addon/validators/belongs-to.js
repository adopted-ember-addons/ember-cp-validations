/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import Base from 'ember-cp-validations/validators/base';
import { isPromise } from 'ember-cp-validations/utils/utils';

const {
  get
} = Ember;

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
const BelongsTo = Base.extend({
  validate(value, ...args) {
    if (value) {
      if (isPromise(value)) {
        return value.then((model) => this.validate(model, ...args));
      }

      return get(value, 'validations');
    }

    return true;
  }
});

BelongsTo.reopenClass({
  getDependentsFor(attribute) {
    return [
      `model.${attribute}.isDeleted`,
      `model.${attribute}.content.isDeleted`,
      `model.${attribute}.validations`,
      `model.${attribute}.content.validations`
    ];
  }
});

export default BelongsTo;
