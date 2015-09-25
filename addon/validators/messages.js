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
  defaultAttributeDescription: 'This field',

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
    return message.replace(get(this, '_regex'), (s, attr) => {
      let value = context[attr];
      if(attr === 'attributeDescription' && isNone(value)) {
        return this.get('defaultAttributeDescription');
      }

      return value;
    });
  },

  inclusion: "{attributeDescription} is not included in the list",
  exclusion: "{attributeDescription} is reserved",
  invalid: "{attributeDescription} is invalid",
  confirmation: "{attributeDescription} doesn't match {attribute}",
  accepted: "{attributeDescription} must be accepted",
  empty: "{attributeDescription} can't be empty",
  blank: "{attributeDescription} can't be blank",
  present: "{attributeDescription} must be blank",
  collection: "{attributeDescription} must be a collection",
  singular: "{attributeDescription} can't be a collection",
  tooLong: "{attributeDescription} is too long (maximum is {count} characters)",
  tooShort: "{attributeDescription} is too short (minimum is {count} characters)",
  before: "{attributeDescription} must be before {date}",
  after: "{attributeDescription} must be after {date}",
  wrongDateFormat: "{attributeDescription} must be in the format of {date}",
  wrongLength: "{attributeDescription} is the wrong length (should be {count} characters)",
  notANumber: "{attributeDescription} is not a number",
  notAnInteger: "{attributeDescription} must be an integer",
  greaterThan: "{attributeDescription} must be greater than {count}",
  greaterThanOrEqualTo: "{attributeDescription} must be greater than or equal to {count}",
  equalTo: "{attributeDescription} must be equal to {count}",
  lessThan: "{attributeDescription} must be less than {count}",
  lessThanOrEqualTo: "{attributeDescription} must be less than or equal to {count}",
  otherThan: "{attributeDescription} must be other than {count}",
  odd: "{attributeDescription} must be odd",
  even: "{attributeDescription} must be even",
  positive: "{attributeDescription} must be positive",
  date: "{attributeDescription} must be a valid date",
  email: "{attributeDescription} must be a valid email address",
  phone: "{attributeDescription} must be a valid phone number",
  url: "{attributeDescription} must be a valid url"
});
