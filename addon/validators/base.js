/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';

const {
  get,
  setProperties,
  isNone,
  typeOf
} = Ember;

export default Ember.Object.extend({
  /**
   * Options passed in to the validator when defined in the model
   * @type {Object}
   */
  options: null,

  /**
   * Model instance
   * @type {Model}
   */
  model: null,

  /**
   * Attributed name of the model this validator is attached to
   * @type {String}
   */
  attribute: null,

  /**
   * Default error messages. Populated by validators/messages
   * @type {Object}
   */
  defaultMessages: null,

  // Private
  /**
   * Validator type
   * @type {String}
   */
  _type: null,

  init() {
    this._super(...arguments);
    var container = get(this, 'container');
    var options = get(this, 'options');
    var defaultMessages = {};

    if(container) {
      // Since default error messages are stored in app/validators/messages, we have to look it up via the container
      defaultMessages = container.lookupFactory('validator:messages');
    }

    setProperties(this, {
      options: isNone(options) ? {} : options,
      defaultMessages
    });
  },

  /**
   * Override this method with your own custom logic.
   * All arguments passed in are also properties of this object
   * @param  {Unknown} value        : The current value of the attribute
   * @param  {Object} options       : The options passed in to the validator
   * @param  {Object} model         : The current model being evaluated
   * @param  {String} attribute     : The current attribute being evaluated
   * @return {[String or Boolean]}  : Returns a string with a message if an error is found or false
   *                                validation passes.
   */
  validate( /*value, options, model, attribute*/ ) {
    return true;
  },

  /**
   * Error message generator based on type and options
   * @param  {String} type        : The type of message template to use
   * @param  {Object} options     : Validator options
   * @param  {?} value            : Current value being evaluated
   * @param  {...Array} Formats   : String formatters (%@)
   * @return {String}             : The generated message
   */
  createErrorMessage(type, options, value, ...formats) {
    options = options || {};
    var attribute = options.attributeDescription || 'This field';
    var defaultMessages = this.get('defaultMessages');
    var message;
    attribute = `${attribute.trim()} `;

    if (options.message) {
      if (typeOf(options.message) === 'string') {
        message = options.message;
      } else if (typeOf(options.message) === 'function') {
        message = options.message.call(this, type, options, value);
        message = message || defaultMessages[type]; // fail-safe to default message of type
      }
    } else {
      message = defaultMessages[type];
    }

    message = message || defaultMessages.invalid;
    message = Ember.String.fmt(message, ...formats);

    return (attribute + message).trim();
  }
});
