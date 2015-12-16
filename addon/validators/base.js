/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import Messages from './messages';
import getOwner from 'ember-getowner-polyfill';

const {
  get,
  set,
  merge,
  isNone,
} = Ember;

export default Ember.Object.extend({
  /**
   * Options passed in to the validator when defined in the model
   * @type {Object}
   */
  options: undefined,

  /**
   * Default validations options for this specific attribute
   * @type {Object}
   */
  defaultOptions: undefined,

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
    var owner = getOwner(this);
    var options = get(this, 'options');
    var defaultOptions = get(this, 'defaultOptions');
    var errorMessages;

    if (!isNone(owner)) {
      // Since default error messages are stored in app/validators/messages, we have to look it up via the owner
      errorMessages = owner._lookupFactory('validator:messages');
    }

    // If for some reason, we can't find the messages object (i.e. unit tests), use default
    errorMessages = errorMessages || Messages;

    set(this, 'options', this.buildOptions(options, defaultOptions));
    set(this, 'errorMessages', errorMessages.create());
  },

  /**
   * Build options hook. Merges default options into options object
   * @param  {Object} options
   * @param  {Object} defaultOptions
   * @return {Object}
   */
  buildOptions(options = {}, defaultOptions = {}) {
    Object.keys(defaultOptions).forEach(key => {
      if (isNone(options[key])) {
        options[key] = defaultOptions[key];
      }
    });

    return options;
  },

  /**
   * Creates a new object and calls any option property that is a function with
   * the validator context. This object will be passed into the validate method
   * @return {Object}
   */
  processOptions() {
    let options = merge({}, get(this, 'options') || {});
    Object.keys(options).forEach(key => {
      let opt = options[key];
      if (typeof opt === 'function' && key !== 'message') {
        options[key] = opt.call(this);
      }
    });

    return options;
  },

  /**
   * Override this method with your own custom logic.
   * All arguments passed in are also properties of this object
   * @param  {Unknown} value        : The current value of the attribute
   * @param  {Object} options       : The built and processed options
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
   * @param  value                : Current value being evaluated
   * @param  {Object} options     : Validator built and processed options
   * @return {String}             : The generated message
   */
  createErrorMessage(type, value, options = {}) {
    var messages = this.get('errorMessages');
    var message;

    options.description = messages.getDescriptionFor(get(this, 'attribute'), options);

    if (options.message) {
      if (typeof options.message === 'string') {
        message = messages.formatMessage(options.message, options);
      } else if (typeof options.message === 'function') {
        message = options.message.apply(this, arguments);
        message = isNone(message) ? messages.getMessageFor(type, options) : messages.formatMessage(message, options); // fail-safe to default message of type
      }
    } else {
      message = messages.getMessageFor(type, options);
    }

    return message.trim();
  }
});
