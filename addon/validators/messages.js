/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
import Ember from 'ember';

const {
  get,
  isNone,
} = Ember;

export default Ember.Object.extend({
  /**
   * Regex for matching error message placeholders
   * @type {RegExp}
   */
  _regex: /\{(\w+)\}/g,

  /**
   * Default attribute description if one isnt passed into a validator's options
   * @type {String}
   */
  defaultDescription: 'This field',

  /**
   * Get a description for a specific attribute. This is a hook
   * for i18n solutions to retrieve attribute descriptions from a translation
   * @param  {String} attribute
   * @param  {Object} options
   * @return {String}
   */
  getDescriptionFor(attribute, options = {}) {
    return options.description || get(this, 'defaultDescription');
  },

  /**
   * Get a message with a given type
   * @param  {String} type
   * @param  {Object} context
   * @return {String}
   */
  getMessageFor(type, context = {}) {
    return this.formatMessage(get(this, type), context);
  },

  /**
   * Regex replace all placeholders with their given context
   * @param  {String} message
   * @param  {Object} context
   * @return {String}
   */
  formatMessage(message, context = {}) {
    if (isNone(message) || typeof message !== 'string') {
      message = get(this, 'invalid');
    }
    return message.replace(get(this, '_regex'), (s, attr) => context[attr]);
  },

  /**
   * Default validation error message strings
   */
  inclusion: "{description} is not included in the list",
  exclusion: "{description} is reserved",
  invalid: "{description} is invalid",
  confirmation: "{description} doesn’t match {on}",
  accepted: "{description} must be accepted",
  empty: "{description} can’t be empty",
  blank: "{description} can’t be blank",
  present: "{description} must be blank",
  collection: "{description} must be a collection",
  singular: "{description} can’t be a collection",
  tooLong: "{description} is too long (maximum is {max} characters)",
  tooShort: "{description} is too short (minimum is {min} characters)",
  before: "{description} must be before {before}",
  after: "{description} must be after {after}",
  wrongDateFormat: "{description} must be in the format of {format}",
  wrongLength: "{description} is the wrong length (should be {is} characters)",
  notANumber: "{description} must be a number",
  notAnInteger: "{description} must be an integer",
  greaterThan: "{description} must be greater than {gt}",
  greaterThanOrEqualTo: "{description} must be greater than or equal to {gte}",
  equalTo: "{description} must be equal to {is}",
  lessThan: "{description} must be less than {lt}",
  lessThanOrEqualTo: "{description} must be less than or equal to {lte}",
  otherThan: "{description} must be other than {value}",
  odd: "{description} must be odd",
  even: "{description} must be even",
  positive: "{description} must be positive",
  date: "{description} must be a valid date",
  email: "{description} must be a valid email address",
  phone: "{description} must be a valid phone number",
  url: "{description} must be a valid url",
});
