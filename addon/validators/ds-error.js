/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import Base from 'ember-cp-validations/validators/base';
const DS = self.DS;

if (typeof self.DS === 'undefined') {
  throw new Error('Ember-Data is required to use the DS Error validator.');
}

const {
  get,
  isNone
} = Ember;

/**
 *  Creates a link between this library and Ember-Data's [DS.Errors](http://emberjs.com/api/data/classes/DS.Errors.html)
 *  to fetch the latest message for the given attribute.
 *
 *  ```javascript
 *  // Examples
 *  validator('ds-error')
 *  ```
 *
 *  @class DS Error
 *  @module Validators
 *  @extends Base
 */
const DSError = Base.extend({
  validate(value, options, model, attribute) {
    const errors = get(model, 'errors');

    if (!isNone(errors) && errors instanceof DS.Errors && errors.has(attribute)) {
      return get(errors.errorsFor(attribute), 'lastObject.message');
    }

    return true;
  }
});

DSError.reopenClass({
  getDependentsFor(attribute) {
    return [ `_model.errors.${attribute}.[]` ];
  }
});

export default DSError;
