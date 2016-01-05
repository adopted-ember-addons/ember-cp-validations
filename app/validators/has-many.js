/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import Base from 'ember-cp-validations/validators/base';

const {
  canInvoke,
  A: emberArray
} = Ember;

/**
 *  Identifies a `has-many` relationship in an Ember Data Model. This is used to create a validation collection of the `has-many` validations.
 *
 *  _**Note:** Validations must exist on **all** models_
 *
 *  ```javascript
 *  // model/users.js
 *
 *  var Validations = buildValidations({
 *    friends: validator('has-many')
 *  });
 *
 *  export default DS.Model.extend(Validations, {
 *    'friends': DS.hasMany('user')
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
export default Base.extend({
  validate(value) {
    if (value) {
      if (canInvoke(value, 'then')) {
        return value.then((models) => {
          return emberArray(models).getEach('validations');
        });
      } else {
        return value.toArray().getEach('validations');
      }
    }

    return true;
  }
});
