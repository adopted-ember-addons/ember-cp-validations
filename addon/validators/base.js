/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import Messages from './messages';

const {
  get,
  setProperties,
  isNone,
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
  errorMessages: null,

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
    var errorMessages = Messages;

    if(container) {
      // Since default error messages are stored in app/validators/messages, we have to look it up via the container
      errorMessages = container.lookupFactory('validator:messages');
    }

    errorMessages = errorMessages.create();

    setProperties(this, {
      options: isNone(options) ? {} : options,
      errorMessages
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
   * @param  value                : Current value being evaluated
   * @param  {Object} context     : Context for string replacement
   * @return {String}             : The generated message
   */
  createErrorMessage(type, options, value, context) {
    options = options || {};
    var attribute = options.attributeDescription || 'This field';
    var messages = this.get('errorMessages');
    var message;

    attribute = `${attribute.trim()} `;

    if (options.message) {
      if (typeof options.message === 'string') {
        message = messages.formatMessage(options.message, context);
      } else if (typeof options.message === 'function') {
        message = options.message.call(this, ...arguments);
        message = isNone(message) ? messages.getMessageFor(type, context) : messages.formatMessage(message, context); // fail-safe to default message of type
      }
    } else {
      message = messages.getMessageFor(type, context);
    }

    return (attribute + message).trim();
  }
});
