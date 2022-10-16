import EmberValidator from 'ember-cp-validations/-private/ember-validator';
import { assert } from '@ember/debug';

/**
 *  <i class="fa fa-hand-o-right" aria-hidden="true"></i> [See All Options](#method_validate)
 *
 *  Validate over a date range. Uses the native Date and Intl APIs. Will parse strings using `new Date(<string>)`,
 *  so care must be taken to ensure you use only ISO 8601 strings if you want cross-browser compatibility.
 *
 * ## Examples
 *
 * To set `before`, `onOrBefore`, `after`, or `onOrAfter` to the current instant, use a JS getter:
 *
 *  ```javascript
 *  validator('date', {
 *    get after(): { return Date.now(); },
 *    before: '2020/01/01T00:00:00.0000Z', // Must be ISO or Date!
 *  })
 *  ```
 *
 *  @class Date
 *  @module Validators
 *  @extends Base
 */
export default EmberValidator.extend({
  _evType: 'date',

  validate(value, options) {
    // Help applications recognize no longer supported configurations for the default date validator:
    assert(
      "the default 'date' validator no longer accepts a string 'format' option",
      typeof options.format !== 'string'
    );
    assert(
      "the default 'date' validator does not support a 'precision' option",
      !options.precision
    );
    assert(
      "the default 'date' validator does not accept the string 'now'; use a getter instead",
      options.before !== 'now' &&
        options.onOrBefore !== 'now' &&
        options.after !== 'now' &&
        options.onOrAfter !== 'now'
    );

    // Use the date validator supplied by ember-validators:
    return super.validate(...arguments);
  },
});
