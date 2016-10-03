/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import EmberValidator from 'ember-cp-validations/-private/ember-validator';

/**
 *  Validate over a date range. Uses [MomentJS](http://momentjs.com/) for date mathematics and calculations.
 *
 *  -*Note**: MomentJS must be installed to be able to use this validator. The easiest way to do this is to install [ember-moment](https://github.com/stefanpenner/ember-moment)
 *
 *   #### Options
 *  - `allowBlank` (**Boolean**): If true, skips validation if the value is empty
 *  - `before` (**String**): The specified date must be before this date
 *  - `onOrBefore` (**String**): The specified date must be on or before this date
 *  - `after` (**String**): The specified date must be after this date
 *  - `onOrAfter` (**String**): The specified date must be on or after this date
 *  - `precision` (**String**): Limit the comparison check to a specific granularity. Options: year, month, week, day, hour, minute, second.
 *  - `format` (**String**): Input value date format
 *  - `errorFormat` (**String**): Error output date format. Defaults to `MMM Do, YYYY`
 *
 *  ```javascript
 *  // Example
 *  validator('date', {
 *      after: 'now',
 *      before: '1/1/2020',
 *      precision: 'day',
 *      format: 'M/D/YYY',
 *      errorFormat: 'M/D/YYY'
 *  })
 *  // If before, onOrBefore, after, or onOrAfter is set to 'now', the value given to the validator will be tested against the current date and time.
 *  ```
 *
 *  @class Date
 *  @module Validators
 *  @extends Base
 */
export default EmberValidator.extend({
  _type: 'date'
});
