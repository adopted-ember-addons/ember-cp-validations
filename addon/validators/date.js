/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import Base from './base';
const moment = (self.requirejs.entries.moment || self.requirejs.entries['moment/index']) && self.require('moment').default;

if (typeof moment === 'undefined') {
  throw new Error('MomentJS is required to use the Date validator. The easiest way to install moment.js is to install ember-moment.\n' +
    'Installation instructions and documentation can be found at https://github.com/stefanpenner/ember-moment');
}

const {
  isEmpty
} = Ember;

/**
 *  Validate over a date range. Uses [MomentJS](http://momentjs.com/) for date mathematics and calculations.
 *
 *  -*Note**: MomentJS must be installed to be able to use this validator. The easiest way to do this is to install [ember-moment](https://github.com/stefanpenner/ember-moment)
 *
 *   #### Options
 *  - `allowBlank` (**Boolean**): If true, skips validation if the value is empty
 *  - `before` (**String**): The specified date must be before this date
 *  - `after` (**String**): The specified date must be after this date
 *  - `format` (**String**): Input value date format
 *  - `errorFormat` (**String**): Error output date format. Defaults to `MMM Do, YYYY`
 *
 *  ```javascript
 *  // Example
 *  validator('date', {
 *      after: 'now',
 *      before: '1/1/2020',
 *      format: 'M/D/YYY',
 *      errorFormat: 'M/D/YYY'
 *  })
 *  // If before or after is set to 'now', the value given to the validator will be tested against the current date and time.
 *  ```
 *
 *  @class Date
 *  @module Validators
 *  @extends Base
 */
export default Base.extend({

  _parseDate(dateStr, format) {
    if (dateStr === 'now' || isEmpty(dateStr)) {
      return moment();
    }
    return format ? moment(dateStr, format) : moment(new Date(dateStr));
  },

  validate(value, options) {
    const errorFormat = options.errorFormat || 'MMM Do, YYYY';
    const format = options.format;
    let { before, after } = options;

    if (options.allowBlank && isEmpty(value)) {
      return true;
    }

    const date = this._parseDate(value, format);

    if (!date.isValid()) {
      return this.createErrorMessage('date', value, options);
    }

    if (format && !moment(value, format, true).isValid()) {
      return this.createErrorMessage('wrongDateFormat', value, options);
    }

    if (before) {
      before = this._parseDate(before, format);
      if (before < date) {
        options.before = before.format(errorFormat);
        return this.createErrorMessage('before', value, options);
      }
    }

    if (after) {
      after = this._parseDate(after, format);
      if (after > date) {
        options.after = after.format(errorFormat);
        return this.createErrorMessage('after', value, options);
      }
    }

    return true;
  }
});
