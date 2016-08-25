/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import Base from 'ember-cp-validations/validators/base';

const {
  A,
  get,
  getWithDefault,
  getProperties,
  assert,
  isNone,
  isEmpty,
  isPresent,
  isArray
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
const Dependent = Base.extend({
  validate(value, options, model, attribute) {
    const { on, allowBlank } = getProperties(options, ['on', 'allowBlank']);

    assert(`[validator:dependent] [${attribute}] option 'on' is required`, isPresent(on));

    if (isNone(model)) {
      return true;
    }

    if (allowBlank && isEmpty(value)) {
      return true;
    }

    const dependentValidations = getWithDefault(options, 'on', A()).map(dependent => get(model, `validations.attrs.${dependent}`));

    if (!isEmpty(dependentValidations.filter(v => !get(v, 'isTruelyValid')))) {
      return this.createErrorMessage('invalid', value, options);
    }

    return true;
  }
});

Dependent.reopenClass({
  getDependentsFor(attribute, options) {
    const dependents = get(options, 'on');

    assert(`[validator:dependent] [${attribute}] 'on' must be an array`, isArray(dependents));

    if (!isEmpty(dependents)) {
      return dependents.map(dependent => `${dependent}.isTruelyValid`);
    }

    return [];
  }
});

export default Dependent;
