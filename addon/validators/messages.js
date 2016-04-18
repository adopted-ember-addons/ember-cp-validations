/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
import Ember from 'ember';

const {
  get,
  isNone
} = Ember;

/**
 *  The default validation error messages are imported in your app's `validators` folder.
 *  If you want to change or extend them, all you need to do is create a `messages.js` file under `app/validators`.
 *
 *  ```javascript
 *  // app/validators/messages.js
 *
 *  import Messages from 'ember-cp-validations/validators/messages';
 *
 *  export default Messages.extend({
 *    uniqueUsername: '{description} {username} already exists'
 *  });
 *  ```
 *
 *  Within this object, you can overwrite the [default messages](https://github.com/offirgolan/ember-cp-validations/blob/master/addon/validators/messages.js) or create new messages just like in the example above.
 *  If a message of a given type is not found, it will default to the `invalid` message.
 *  Usage examples can be found {{#crossLink "Base/createErrorMessage:method"}}here{{/crossLink}}
 *
 *  @class Messages
 *  @module Validators
 */
export default Ember.Object.extend({

  /**
   * Regex for matching error message placeholders
   * @private
   * @property _regex
   * @type {RegExp}
   */
  _regex: /\{(\w+)\}/g,

  /**
   * Default attribute description if one isnt passed into a validator's options
   * @property defaultDescription
   * @type {String}
   */
  defaultDescription: 'This field',

  /**
   * Get a description for a specific attribute. This is a hook
   * for i18n solutions to retrieve attribute descriptions from a translation
   * @method getDescriptionFor
   * @param  {String} attribute
   * @param  {Object} options
   * @return {String}
   */
  getDescriptionFor(attribute, options = {}) {
    return options.description || get(this, 'defaultDescription');
  },

  /**
   * Get a message with a given type
   * @method getMessageFor
   * @param  {String} type
   * @param  {Object} context
   * @return {String}
   */
  getMessageFor(type, context = {}) {
    return this.formatMessage(get(this, type), context);
  },

  /**
   * Regex replace all placeholders with their given context
   * @method formatMessage
   * @param  {String} message
   * @param  {Object} context
   * @return {String}
   */
  formatMessage(message, context = {}) {
    let m = message;

    if (isNone(m) || typeof m !== 'string') {
      m = get(this, 'invalid');
    }
    return m.replace(get(this, '_regex'), (s, attr) => context[attr]);
  },

  /**
   * Default validation error message strings
   */
  inclusion: '{description} is not included in the list',
  exclusion: '{description} is reserved',
  invalid: '{description} is invalid',
  confirmation: '{description} doesn\'t match {on}',
  accepted: '{description} must be accepted',
  empty: '{description} can\'t be empty',
  blank: '{description} can\'t be blank',
  present: '{description} must be blank',
  collection: '{description} must be a collection',
  singular: '{description} can\'t be a collection',
  tooLong: '{description} is too long (maximum is {max} characters)',
  tooShort: '{description} is too short (minimum is {min} characters)',
  before: '{description} must be before {before}',
  onOrBefore: '{description} must be on or before {onOrBefore}',
  after: '{description} must be after {after}',
  onOrAfter: '{description} must be on or after {onOrAfter}',
  wrongDateFormat: '{description} must be in the format of {format}',
  wrongLength: '{description} is the wrong length (should be {is} characters)',
  notANumber: '{description} must be a number',
  notAnInteger: '{description} must be an integer',
  greaterThan: '{description} must be greater than {gt}',
  greaterThanOrEqualTo: '{description} must be greater than or equal to {gte}',
  equalTo: '{description} must be equal to {is}',
  lessThan: '{description} must be less than {lt}',
  lessThanOrEqualTo: '{description} must be less than or equal to {lte}',
  otherThan: '{description} must be other than {value}',
  odd: '{description} must be odd',
  even: '{description} must be even',
  positive: '{description} must be positive',
  date: '{description} must be a valid date',
  email: '{description} must be a valid email address',
  phone: '{description} must be a valid phone number',
  url: '{description} must be a valid url'
});
