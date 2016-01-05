/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import Base from 'ember-cp-validations/validators/base';

const {
  get,
  canInvoke
} = Ember;


/**
 *  Identifies a `belongs-to` relationship in an Ember Data Model. This is used to create a link to the validations object of the child model.
 *
 *  _**Note:** Validations must exist on **both** models_
 *
 *  ```javascript
 *  // model/users.js
 *
 *  var Validations = buildValidations({
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
 *  var Validations = buildValidations({
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
 *  From our `user` model, we can now check any validation propery on the `user-details` model.
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
export default Base.extend({
  validate(value) {
    if (value) {
      if (canInvoke(value, 'then')) {
        return value.then((model) => {
          return get(model, 'validations');
        });
      } else {
        return get(value, 'validations');
      }
    }

    return true;
  }
});
