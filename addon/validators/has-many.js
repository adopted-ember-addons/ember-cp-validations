/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import Base from 'ember-cp-validations/validators/base';
import ResultCollection from 'ember-cp-validations/validations/result-collection';
import { isPromise } from 'ember-cp-validations/utils/utils';

const {
  get
} = Ember;

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
const HasMany = Base.extend({
  validate(value, ...args) {
    if (value) {
      if (isPromise(value)) {
        return value.then((models) => this.validate(models, ...args));
      }

      let validations = ResultCollection.create({
        attribute: `Has-Many:${value}`,
        content: value.map((m) => m.get('validations'))
      });

      if (get(validations, 'isAsync')) {
        console.log('hasMany', ...args);
        return get(validations, '_promise').then(() => {
          console.log('hasMany:done', ...args);
          return validations;
        });
      }

      return validations;
    }

    return true;
  }
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
      `model.${attribute}.content.@each.validations`
    ];
  }
});

export default HasMany;
