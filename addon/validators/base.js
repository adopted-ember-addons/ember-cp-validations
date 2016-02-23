/**
 * Copyright 2016, Yahoo! Inc.
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

/**
 * @class Base
 * @module Validators
 */
export default Ember.Object.extend({
  /**
   * Options passed in to the validator when defined in the model
   * @property options
   * @type {Object}
   */
  options: undefined,

  /**
   * Default validations options for this specific attribute
   * @property defaultOptions
   * @type {Object}
   */
  defaultOptions: undefined,

  /**
   * Model instance
   * @property model
   * @type {Model}
   */
  model: null,

  /**
   * Attributed name of the model this validator is attached to
   * @property attribute
   * @type {String}
   */
  attribute: null,

  /**
   * Error message object. Populated by validators/messages
   * @property errorMessages
   * @type {Object}
   */
  errorMessages: null,

  /**
   * Validator type
   * @property _type
   * @private
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
   * Build options hook. Merges default options into options object.
   * This method gets called on init and is the ideal place to normalize your options.
   * The [presence validator](https://github.com/offirgolan/ember-cp-validations/blob/master/app/validators/presence.js) is a good example to checkout
   * @method buildOptions
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
   * Creates a new object and calls any option property that is a function with the validator context.
   * This method is called right before `validate` and the returned object gets passed into the validate method as its options
   * @method processOptions
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
   * The validate method is where all of your logic should go.
   * It will get passed in the current value of the attribute this validator is attached to.
   * Within the validator object, you will have access to the following properties:
   * @method validate
   * @param  {Unknown} value        The current value of the attribute
   * @param  {Object} options       The built and processed options
   * @param  {Object} model         The current model being evaluated
   * @param  {String} attribute     The current attribute being evaluated
   * @return
   * One of the following types:
   * - `Boolean`:  `true` if the current value passed the validation
   * - `String`: The error message
   * - `Promise`: A promise that will either resolve or reject, and will finally return either `true` or the final error message string.
   */
  validate( /*value, options, model, attribute*/ ) {
    return true;
  },

  /**
   * Used by all pre-defined validators to build an error message that is present
   * in `validators/message` or decalred in your i18n solution.
   *
   * If we extended our default messages to include `uniqueUsername: '{username} already exists'`,
   * we can use this method to generate our error message.
   *
   * ```javascript
   * validate(value, options) {
   *   var exists = false;
   *
   *   options.description = 'Username';
   *   options.username = value;
   *
   *   // check with server if username exists...
   *
   *   if(exists) {
   *     return this.createErrorMessage('uniqueUsername', value, options);
   *   }
   *
   *   return true;
   * }
   * ```
   *
   * If we input `johndoe` and that username already exists, the returned message would be `'johndoe already exists'`.
   *
   * @method createErrorMessage
   * @param  {String} type        The type of message template to use
   * @param  value                Current value being evaluated
   * @param  {Object} options     Validator built and processed options (used as the message string context)
   * @return {String}             The generated message
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

/**
 * Creating custom validators is very simple. To generate a validator named `unique-username` in Ember CLI
 *
 * ```bash
 * ember generate validator unique-username
 * ```
 *
 * This will create the following files
 *
 * * `app/validators/unique-username.js`
 * * `tests/unit/validators/unique-username-test.js`
 *
 * ```javascript
 * // app/validators/unique-username.js
 *
 * import Ember from 'ember';
 * import BaseValidator from 'ember-cp-validations/validators/base';
 *
 * export default BaseValidator.extend({
 *   validate(value, options, model, attribute) {
 *     return true;
 *     })
 *   }
 * });
 * ```
 *
 * **Side Node**: Before we continue, I would suggest checking out the documentation for the {{#crossLink 'Base'}}Base Validator{{/crossLink}}.
 *
 * If you want to interact with the `store` within your validator, you can simply inject the service like you would a component. Since you have access to your model and the current value, you should be able to send the server the right information to determine if this username is unique.
 *
 * ```javascript
 * // app/validators/unique-username.js
 *
 * import Ember from 'ember';
 * import BaseValidator from 'ember-cp-validations/validators/base';
 *
 * export default BaseValidator.extend({
 *   store: Ember.inject.service(),
   *
 *   validate(value, options, model, attribute) {
 *     return this.get('store').findRecord('user', value).then((user) => {
 *       if(user && user.id === value) {
 *         let message = `The username '${value}' already exists.`;
 *         let meta = user.get('meta');
 *
 *         if(options.showSuggestions && meta && meta.suggestions) {
 *           message += "What about one of the these: " + meta.suggestions.join(', ');
 *         }
 *         return message;
 *       } else {
 *         return true;
 *       }
 *     })
 *   }
 * });
 * ```
 *
 * To use our unique-username validator we just have to add it to the model definition
 *
 * ```javascript
 * var Validations = buildValidations({
 *   username: validator('unique-username', {
 *     showSuggestions: true
 *   }),
 * });
 *
 * export default DS.Model.extend(Validations, {
 *   'username': DS.attr('string'),
 * });
 * ```
 *
 * ## Testing
 * As mentioned before, the generator created a unit test for your new custom validator.
 *
 * ```javascript
 * // tests/unit/validators/unique-username-test.js
 *
 * import Ember from 'ember';
 * import { moduleFor, test } from 'ember-qunit';
 *
 * moduleFor('validator:unique-username', 'Unit | Validator | unique-username', {
 *     needs: ['validator:messages']
 * });
 *
 * test('it works', function(assert) {
 *     var validator =  this.subject();
 *     assert.ok(validator);
 * });
 * ```
 *
 * A simple test for our validation method can be as such
 *
 * ```javascript
 * test('username is unique', function(assert) {
 *     assert.expect(1);
 *
 *     let validator =  this.subject();
 *     let done = assert.async();
     *
 *     validator.validate('johndoe42').then((message) => {
 *       assert.equal(message, true);
 *       done();
 *     });
 * });
 * ```
 *  @class Custom
 *  @module Validators
 *  @extends Base
 */
