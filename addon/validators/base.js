import { isNone } from '@ember/utils';
import { getOwner } from '@ember/application';
import Messages from 'ember-cp-validations/validators/messages';
import Options from 'ember-cp-validations/-private/options';
import lookupValidator from 'ember-cp-validations/utils/lookup-validator';
import {
  unwrapString,
  getValidatableValue,
} from 'ember-cp-validations/utils/utils';
import { tracked } from '@glimmer/tracking';

class TestResult {
  constructor(result) {
    Object.assign(this, {
      isValid: result === true,
      message: typeof result === 'string' ? result : null,
    });
  }
}

/**
 * @class Base
 * @module Validators
 */
export default class ValidatorsBase {
  /**
   * Options passed in to the validator when defined in the model
   * @property options
   * @type {Object}
   */
  @tracked options;

  /**
   * Default validation options for this specific attribute
   * @property defaultOptions
   * @type {Object}
   */
  @tracked defaultOptions;

  /**
   * Global validation options for this model
   * @property globalOptions
   * @type {Object}
   */
  @tracked globalOptions;

  /**
   * Model instance
   * @property model
   * @type {Model}
   */
  @tracked model;

  /**
   * Attributed name of the model this validator is attached to
   * @property attribute
   * @type {String}
   */
  @tracked attribute;

  /**
   * Error message object. Populated by validators/messages
   * @property errorMessages
   * @type {Object}
   */
  @tracked errorMessages;

  /**
   * @property isWarning
   * @type {Boolean}
   */
  get isWarning() {
    return this.options.isWarning;
  }

  /**
   * Validator type
   * @property _type
   * @private
   * @type {String}
   */
  @tracked _type;

  /**
   * Validators cache used by `test` api
   * @property _testValidatorCache
   * @private
   * @type {Object}
   */
  _testValidatorCache = {};

  static create(props) {
    return new ValidatorsBase(props);
  }

  constructor(props = {}) {
    Object.assign(this, props);

    let owner = getOwner(this);
    let errorMessages;

    if (!isNone(owner)) {
      // Since default error messages are stored in app/validators/messages, we have to look it up via the owner
      errorMessages = owner.factoryFor('validator:messages');
    }

    this.options = this.buildOptions(
      props.options,
      props.defaultOptions,
      props.globalOptions
    );
    this.errorMessages = (errorMessages ?? Messages).create();
  }

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
    // Overwrite the validator's value method if it exists in the options and remove it since
    // there is no need for it to be passed around
    if (options.value) {
      this.value = options.value;
      delete options.value;
    }

    return new Options(
      this.model,
      this.attribute,
      options,
      defaultOptions,
      globalOptions
    );
  }

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
    return model[attribute];
  }

  /**
   * Wrapper method to `value` that passes the necessary parameters
   *
   * @method getValue
   * @private
   * @return {Mixed} value
   */
  getValue() {
    let value = this.value(this.model, this.attribute);
    return getValidatableValue(value);
  }

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
   */
  validate() {
    return true;
  }

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
    let messages = this.errorMessages;
    let message = unwrapString(options.message);

    options.description = messages.getDescriptionFor(this.attribute, options);

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
  }

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
   *                            'belongs-to', 'dependent', 'has-many'
   * @param  {...args} args   The arguments to pass through to the validator
   * @return {Object}         The test result object which will contain `isValid`
   *                          and `message`.
   */
  test(type, ...args) {
    const cache = this._testValidatorCache;
    const unsupportedTypes = ['belongs-to', 'dependent', 'has-many'];

    if (unsupportedTypes.includes(type)) {
      throw new Error(
        `[ember-cp-validations] The \`test\` API does not support validators of type: ${type}.`
      );
    }

    cache[type] = cache[type] ?? lookupValidator(getOwner(this), type).create();
    const result = cache[type].validate(...args);

    return new TestResult(result);
  }
}

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
 * import Ember from 'ember';
 * import { moduleFor, test } from 'ember-qunit';
 *
 * moduleFor('validator:unique-username', 'Unit | Validator | unique-username', {
 *     needs: ['validator:messages']
 * });
 *
 * test('it works', function(assert) {
 *     const validator =  this.subject();
 *     assert.ok(validator);
 * });
 * ```
 *  @class Custom
 *  @module Validators
 *  @extends Base
 */
