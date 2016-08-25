/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Base from 'ember-cp-validations/validators/base';
import { default as validateDsError, getPathAndKey } from 'ember-validators/ds-error';

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
  validate() {
    return validateDsError(this, ...arguments);
  }
});

DSError.reopenClass({
  getDependentsFor(attribute) {
    let { path, key } = getPathAndKey(attribute);

    return [`model.${path}.${key}.[]`];
  }
});

export default DSError;
