/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import EmberValidator from 'ember-cp-validations/-private/ember-validator';

/**
 *  <i class="fa fa-hand-o-right" aria-hidden="true"></i> [See All Options](#method_validate)
 *
 *  Validate over a date range. Uses [MomentJS](http://momentjs.com/) for date mathematics and calculations.
 *
 *  **Note**: MomentJS must be installed to be able to use this validator. The easiest way to do this is to install [ember-moment](https://github.com/stefanpenner/ember-moment)
 *
 * ## Examples
 *
 * If `before`, `onOrBefore`, `after`, or `onOrAfter` is set to **now**, the value given to the validator will be tested against the current date and time.
 *
 *  ```javascript
 *  validator('date', {
 *    after: 'now',
 *    before: '1/1/2020',
 *    precision: 'day',
 *    format: 'M/D/YYY',
 *    errorFormat: 'M/D/YYY'
 *  })
 *  ```
 *
 *  @class Date
 *  @module Validators
 *  @extends Base
 */
export default EmberValidator.extend({
  _evType: 'date'
});
