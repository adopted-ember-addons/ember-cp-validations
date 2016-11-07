/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import EmberValidator from 'ember-cp-validations/-private/ember-validator';
import { getPathAndKey } from 'ember-validators/ds-error';

/**
 *  <i class="fa fa-hand-o-right" aria-hidden="true"></i> [See All Options](#method_validate)
 *
 *  Creates a link between this library and Ember-Data's [DS.Errors](http://emberjs.com/api/data/classes/DS.Errors.html)
 *  to fetch the latest message for the given attribute.
 *
 *  ## Examples
 *
 *  ```javascript
 *  validator('ds-error')
 *  ```
 *
 *  @class DS Error
 *  @module Validators
 *  @extends Base
 */
const DSError = EmberValidator.extend({
  _evType: 'ds-error'
});

DSError.reopenClass({
  getDependentsFor(attribute) {
    let { path, key } = getPathAndKey(attribute);

    return [`model.${path}.${key}.[]`];
  }
});

export default DSError;
