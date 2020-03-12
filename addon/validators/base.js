import { bool } from '@ember/object/computed';
import EmberObject, { set, get, computed } from '@ember/object';
import { isNone } from '@ember/utils';
import { getOwner } from '@ember/application';
import Messages from 'ember-cp-validations/validators/messages';
import Options from 'ember-cp-validations/-private/options';
import lookupValidator from 'ember-cp-validations/utils/lookup-validator';
import {
  unwrapString,
  getValidatableValue,
  mergeOptions,
  isPromise
} from 'ember-cp-validations/utils/utils';

class TestResult {
  constructor(result) {
    this.isValid = result === true;
    this.message = typeof result === 'string' ? result : null;
  }
}

/**
 * @class Base
 * @module Validators
 */
const Base = EmberObject.extend({
  /**
   * Options passed in to the validator when defined in the model
   * @property options
   * @type {Object}
   */
  options: null,

  /**
   * Default validation options for this specific attribute
   * @property defaultOptions
   * @type {Object}
   */
  defaultOptions: null,

  /**
   * Global validation options for this model
   * @property globalOptions
   * @type {Object}
   */
  globalOptions: null,

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
   * @property isWarning
   * @type {Boolean}
   */
  isWarning: bool('options.isWarning').readOnly(),

  /**
   * Validator type
   * @property _type
   * @private
   * @type {String}
   */
  _type: null,

  /**
   * Validators cache used by `test` api
   * @property _testValidatorCache
   * @private
   * @type {Object}
   */
  _testValidatorCache: computed(() => ({})).readOnly(),

  init() {
    this._super(...arguments);
    let globalOptions = get(this, 'globalOptions');
    let defaultOptions = get(this, 'defaultOptions');
    let options = get(this, 'options');
    let owner = getOwner(this);
    let errorMessages;

    if (!isNone(owner)) {
      // Since default error messages are stored in app/validators/messages, we have to look it up via the owner
      errorMessages = owner.factoryFor('validator:messages');
    }

    // If for some reason, we can't find the messages object (i.e. unit tests), use default
    errorMessages = errorMessages || Messages;

    set(
      this,
      'options',
      this.buildOptions(options, defaultOptions, globalOptions)
    );
    set(this, 'errorMessages', errorMessages.create());
  },

  /**
   * Build options hook. Merges default options into options object.
   * This method gets called on init and is the ideal place to normalize your options.
   * The [presence validator](https://github.com/offirgolan/ember-cp-validations/blob/master/addon/validators/presence.js) is a good example to checkout
   * @method buildOptions
   * @param  {Object} options
   * @param  {Object} defaultOptions
   * @param  {Object} globalOptions
   * @return {Object}
   */
  buildOptions(options = {}, defaultOptions = {}, globalOptions = {}) {
    let builtOptions = mergeOptions(options, defaultOptions, globalOptions);

    // Overwrite the validator's value method if it exists in the options and remove it since
    // there is no need for it to be passed around
    this.value = builtOptions.value || this.value;
    delete builtOptions.value;

    return new Options({
      model: get(this, 'model'),
      attribute: get(this, 'attribute'),
      options: builtOptions
    });
  },

  /**
   * Used to retrieve the value to validate.
   * This method gets called right before `validate` and the returned value
   * gets passed into the validate method.
   *
   * @method value
   * @param {Object} model
   * @param {String} attribute
   * @return The current value of `model[attribute]`
   */
  value(model, attribute) {
    return get(model, attribute);
  },

  /**
   * Wrapper method to `value` that passes the necessary parameters
   *
   * @method getValue
   * @private
   * @return {Mixed} value
   */
  getValue() {
    let value = this.value(get(this, 'model'), get(this, 'attribute'));
    return getValidatableValue(value);
  },

  /**
   * The validate method is where all of your logic should go.
   * It will get passed in the current value of the attribute this validator is attached to.
   * Within the validator object, you will have access to the following properties:
   * @method validate
   * @param  {Mixed} value        The current value of the attribute
   * @param  {Object} options       The built and processed options
   * @param  {Object} model         The current model being evaluated
   * @param  {String} attribute     The current attribute being evaluated
   * @return
   * One of the following types:
   * - `Boolean`:  `true` if the current value passed the validation
   * - `String`: The error message
   * - `Promise`: A promise that will either resolve or reject, and will finally return either `true` or the final error message string.
   */
  validate() {
    return true;
  },

  /**
   * Used by all pre-defined validators to build an error message that is present
   * in `validators/message` or declared in your i18n solution.
   *
   * If we extended our default messages to include `uniqueUsername: '{username} already exists'`,
   * we can use this method to generate our error message.
   *
   * ```javascript
   * validate(value, options) {
   *   const exists = false;
   *
   *   // check with server if username exists...
   *
   *   if(exists) {
   *     // The username key on the options object will be used to create the error message
   *     options.username = value;
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
   * @param  {Mixed} value        Current value being evaluated
   * @param  {Object} options     Validator built and processed options (used as the message string context)
   * @return {String}             The generated message
   */
  createErrorMessage(type, value, options = {}) {
    let messages = this.get('errorMessages');
    let message = unwrapString(get(options, 'message'));

    set(
      options,
      'description',
      messages.getDescriptionFor(get(this, 'attribute'), options)
    );

    if (message) {
      if (typeof message === 'string') {
        message = messages.formatMessage(message, options);
      } else if (typeof message === 'function') {
        message = message.apply(this, arguments);
        message = isNone(message)
          ? messages.getMessageFor(type, options)
          : messages.formatMessage(message, options);
      }
    } else {
      message = messages.getMessageFor(type, options);
    }

    return message.trim();
  },

  /**
   * Easily compose complicated validations by using this method to validate
   * against other validators.
   *
   * ```javascript
   * validate(value, options, ...args) {
   *   let result = this.test('presence', value, { presence: true }, ...args);
   *
   *   if (!result.isValid) {
   *     return result.message;
   *   }
   *
   *   // You can even test against your own custom validators
   *   result = this.test('my-validator', value, { foo: 'bar' }, ...args);
   *
   *   if (!result.isValid) {
   *     return result.message;
   *   }
   *
   *   result = this.test('number', value, { integer: true }, ...args);
   *
   *   // You can easily override the error message by returning your own.
   *   if (!result.isValid) {
   *      return 'This value must be an integer!';
   *    }
   *
   *   // Add custom logic...
   *
   *   return true;
   * }
   * ```
   * @method test
   * @param  {String} type    The validator type (e.x. 'presence', 'length', etc.)
   *                          The following types are unsupported:
   *                            'alias', 'belongs-to', 'dependent', 'has-many'
   * @param  {...args} args   The arguments to pass through to the validator
   * @return {Object}         The test result object which will contain `isValid`
   *                          and `message`. If the validator is async, then the
   *                          return value will be a promise.
   */
  test(type, ...args) {
    const cache = this.get('_testValidatorCache');
    const unsupportedTypes = ['alias', 'belongs-to', 'dependent', 'has-many'];

    if (unsupportedTypes.includes(type)) {
      throw new Error(
        `[ember-cp-validations] The \`test\` API does not support validators of type: ${type}.`
      );
    }

    cache[type] = cache[type] || lookupValidator(getOwner(this), type).create();
    const result = cache[type].validate(...args);

    if (isPromise(result)) {
      return result.then(r => new TestResult(r), r => new TestResult(r));
    }

    return new TestResult(result);
  }
});

Base.reopenClass({
  /**
   * Generate the needed dependent keys for this validator
   *
   * @method getDependentsFor
   * @static
   * @param  {String} attribute
   * @param  {Object} options
   * @return {Array} dependent keys
   */
  getDependentsFor() {
    return [];
  }
});

export default Base;

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
 * import BaseValidator from 'ember-cp-validations/validators/base';
 *
 * const UniqueUsername = BaseValidator.extend({
 *   validate(value, options, model, attribute) {
 *     return true;
 *   }
 * });
 *
 * UniqueUsername.reopenClass({
 *   getDependentsFor(attribute, options) {
 *     return [];
 *   }
 * });
 *
 * export default UniqueUsername;
 * ```
 *
 * **Side Note**: Before we continue, I would suggest checking out the documentation for the {{#crossLink 'Base'}}Base Validator{{/crossLink}}.
 *
 * If you want to interact with the `store` within your validator, you can simply inject the service like you would a component.
 * Since you have access to your model and the current value, you should be able to send the server the right information to determine if this username is unique.
 *
 * ```javascript
 * // app/validators/unique-username.js
 *
 * import Ember from 'ember';
 * import BaseValidator from 'ember-cp-validations/validators/base';
 *
 * const UniqueUsername = BaseValidator.extend({
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
 * ## Dependent Keys
 *
 * There will be times when your validator will be dependent on some other property or object. Instead of having to
 * include them in your option's `dependentKeys`, you can declare them in the static `getDependentsFor` hook. This hook
 * receives two parameters. The first is the `attribute` that this validator is being added to, and the second are the `options`
 * there were passed to this validator.
 *
 * From the above code sample:
 *
 * ```javascript
 * // app/validators/unique-username.js
 *
 * import BaseValidator from 'ember-cp-validations/validators/base';
 *
 * const UniqueUsername = BaseValidator.extend({});
 *
 * UniqueUsername.reopenClass({
 *   getDependentsFor(attribute, options) {
 *     return [];
 *   }
 * });
 *
 * export default UniqueUsername;
 * ```
 *
 * All dependent keys are in reference to the model's `validations.attrs` object. So when you return `['username']`,
 * it will add a dependent to `model.validations.attrs.username`. If you want to add a dependent on the model, your
 * key needs to be prefixed with `model`. So when you return `['model.username']`, it will add a dependent to `model.username` instead of `model.validations.attrs.username`.
 * This means that if you have a dependent on a service, that service must be injected into the model since returning `['model.myService.someProperty']`
 * will be interpreted as `model.myService.someProperty`.
 *
 * ## Usage
 *
 * To use our unique-username validator we just have to add it to the model definition
 *
 * ```javascript
 * const Validations = buildValidations({
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
 * import { module, test } from "qunit";
 *
 * module("Unit | Validator | unique-username", function() {
 *     test('it works', function(assert) {
 *         assert.expect(1);
 *         const validator = this.owner.lookup("validator:unique-username");
 *         assert.ok(validator);
 *     })
 * });
 * ```
 *
 * A simple test for our validation method can be as such
 *
 * ```javascript
 * test('username is unique', function(assert) {
 *     assert.expect(1);
 *     let validator = this.owner.lookup("validator:unique-username");
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
