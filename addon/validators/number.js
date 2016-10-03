/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import EmberValidator from 'ember-cp-validations/-private/ember-validator';

/**
 *  Validates that your attributes have only numeric values.
 *
 *   #### Options
 *  - `allowBlank` (**Boolean**): If true, skips validation if the value is empty
 *  - `allowString` (**Boolean**): If true, validator will accept string representation of a number
 *  - `integer` (**Boolean**): Number must be an integer
 *  - `positive` (**Boolean**): Number must be greater than 0
 *  - `odd` (**Boolean**): Number must be odd
 *  - `even` (**Boolean**): Number must be even
 *  - `is` (**Number**): Number must be equal to this value
 *  - `lt` (**Number**): Number must be less than this value
 *  - `lte` (**Number**): Number must be less than or equal to this value
 *  - `gt` (**Number**): Number must be greater than this value
 *  - `gte` (**Number**): Number must be greater than or equal to this value
 *
 *  ```javascript
 *  // Examples
 *  validator('number') // Simple check if the value is a number
 *  validator('number', {
 *      allowString: true,
 *      integer: true,
 *      gt: 5,
 *      lte: 100
 *  })
 *  ```
 *
 *  @class Number
 *  @module Validators
 *  @extends Base
 */
export default EmberValidator.extend({
  _type: 'number'
});
