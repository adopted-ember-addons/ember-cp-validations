/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import EmberValidator from 'ember-cp-validations/-private/ember-validator';

/**
 *  Validates that the attributes’ values are not included in a given list. All comparisons are done using strict equality so type matters! For range, the value type is checked against both lower and upper bounds for type equality.
 *
 *   #### Options
 *  - `allowBlank` (**Boolean**): If true, skips validation if the value is empty
 *  - `in` (**Array**): The list of values this attribute should not be
 *  - `range` (**Array**): The range in which the attribute's value should not reside in
 *
 *  ```javascript
 *  // Examples
 *  validator('exclusion', {
 *      in: ['Admin', 'Super Admin']
 *  })
 *  validator('exclusion', {
 *      range: [0, 5] // Cannot be between 0 (inclusive) to 5 (inclusive)
 *  })
 *  ```
 *
 *  @class Exclusion
 *  @module Validators
 *  @extends Base
 */
export default EmberValidator.extend({
  validatorType: 'exclusion'
});
