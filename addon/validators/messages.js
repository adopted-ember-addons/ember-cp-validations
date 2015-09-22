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
   * Get a message with a given type. Before using the default strings, checks
   * Ember.Intl and Ember.I18n
   * @param  {String} type
   * @param  {Object} context
   * @return {String}
   */
  getMessageFor(type, context = {}) {
    var container = get(this, 'container');
    var key = `errors.${type}`;
    var intl, i18n;

    if (container) {
      intl = container.lookup('service:intl');
      i18n = container.lookup('service:i18n');
    }

    if (i18n && i18n.exists(key)) {
      return i18n.t(key, context);
    }

    if (intl) {
      let m = intl.exists(key);
      if(!isNone(m)) {
        return intl.formatMessage(m, context);
      }
    }

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

  inclusion: "is not included in the list",
  exclusion: "is reserved",
  invalid: "is invalid",
  confirmation: "doesn't match {attribute}",
  accepted: "must be accepted",
  empty: "can't be empty",
  blank: "can't be blank",
  present: "must be blank",
  collection: "must be a collection",
  singular: "can't be a collection",
  tooLong: "is too long (maximum is {count} characters)",
  tooShort: "is too short (minimum is {count} characters)",
  before: "must be before {date}",
  after: "must be after {date}",
  wrongDateFormat: "must be in the format of {date}",
  wrongLength: "is the wrong length (should be {count} characters)",
  notANumber: "is not a number",
  notAnInteger: "must be an integer",
  greaterThan: "must be greater than {count}",
  greaterThanOrEqualTo: "must be greater than or equal to {count}",
  equalTo: "must be equal to {count}",
  lessThan: "must be less than {count}",
  lessThanOrEqualTo: "must be less than or equal to {count}",
  otherThan: "must be other than {count}",
  odd: "must be odd",
  even: "must be even",
  positive: "must be positive",
  date: "must be a valid date",
  email: "must be a valid email address",
  phone: "must be a valid phone number",
  url: "must be a valid url"
});
