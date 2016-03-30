/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import Base from './base';

const {
  get,
  isNone,
  isEmpty
} = Ember;

/**
 *  Defines an attribute as valid only if its dependents are valid.
 *
 *   #### Options
 *  - `on` (**Array**): Attributes this field is dependent on
 *
 *  ```javascript
 *  // Example
 *  // Full name will only be valid if firstName and lastName are filled in
 *  validator('dependent', {
 *      on: ['firstName', 'lastName'],
 *  })
 *  ```
 *
 *  @class Dependent
 *  @module Validators
 *  @extends Base
 */
export default Base.extend({
  validate(value, options, model) {
    if (isNone(options) || isNone(model) || isEmpty(Object.keys(options))) {
      return true;
    }

    if (options.allowBlank && isEmpty(value)) {
      return true;
    }

    if (isEmpty(options.on)) {
      return true;
    }

    const dependentValidations = options.on.map(dependent => get(model, `validations.attrs.${dependent}`));

    if (!isEmpty(dependentValidations.filter(v => !get(v, 'isTruelyValid')))) {
      return this.createErrorMessage('invalid', value, options);
    }

    return true;
  }
});
