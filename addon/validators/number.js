/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import EmberValidator from 'ember-cp-validations/-private/ember-validator';

/**
 *  <i class="fa fa-hand-o-right" aria-hidden="true"></i> [See All Options](#method_validate)
 *
 *  Validates that your attributes have only numeric values.
 *
 *  ## Examples
 *
 *  ```javascript
 *  validator('number') // Simple check if the value is a number
 *  validator('number', {
 *    allowString: true,
 *    integer: true,
 *    gt: 5,
 *    lte: 100
 *  })
 *  ```
 *
 *  @class Number
 *  @module Validators
 *  @extends Base
 */
export default EmberValidator.extend({
  _evType: 'number'
});
