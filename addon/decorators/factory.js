import { A as emberArray, makeArray, isArray } from '@ember/array';
import { isEmpty, isNone } from '@ember/utils';
import { getOwner } from '@ember/application';
import ValidationResult from '../-private/result';
import ResultCollection from '../validations/result-collection';
import lookupValidator from '../utils/lookup-validator';
import { isValidatable } from '../utils/utils';
import { tracked, cached } from '@glimmer/tracking';
import { createCache, getValue } from '@glimmer/tracking/primitives/cache';

/**
 * ## Running Manual Validations
 *
 * Although validations are lazily computed, there are times where we might want to force all or
 * specific validations to happen. For this reason we have exposed three methods:
 *
 * - {{#crossLink "Factory/validate:method"}}{{/crossLink}}: Validates the object
 * - {{#crossLink "Factory/validateAttribute:method"}}{{/crossLink}}: A functional approach to validating an attribute without changing its state
 *
 * @module Validations
 * @main Validations
 */

/**
 * All validations can be accessed via the `validations` object created on your model/object.
 * Each attribute also has its own validation which has the same properties.
 * An attribute validation can be accessed via `validations.attrs.<ATTRIBUTE>` which will return a {{#crossLink "ResultCollection"}}{{/crossLink}}.
 *
 * ### Global Validations
 *
 * Global validations exist on the `validations` object that resides on the object that is being validated.
 * To see all possible properties, please checkout the docs for {{#crossLink "ResultCollection"}}{{/crossLink}}.
 *
 * ```js
 * model.get('validations.isValid');
 * model.get('validations.errors');
 * model.get('validations.messages');
 * // etc...
 * ```
 *
 * ### Attribute Validations
 *
 * The `validations` object also contains an `attrs` object which holds a {{#crossLink "ResultCollection"}}{{/crossLink}}
 * for each attribute specified in your validation rules.
 *
 * ```js
 * model.get('validations.attrs.username.isValid');
 * model.get('validations.attrs.password.errors');
 * model.get('validations.attrs.email.messages');
 * // etc...
 * ```
 * @module Validations
 * @submodule Accessing Validations
 */

/**
 * @module Validations
 * @class Factory
 */

/**
 * Top level method that will ultimately return a mixin with all CP validations
 *
 * @method  buildValidations
 * @param  {Object} validations  Validation rules
 * @return {Decorator}
 */
export default function buildValidations(validations = {}, globalOptions = {}) {
  return function (DecoratedClass) {
    normalizeOptions(validations, globalOptions);
    let ValidationsClass;

    DecoratedClass.prototype.validate = function () {
      return this.validations.validate(...arguments);
    };

    DecoratedClass.prototype.validateAttribute = function () {
      return this.validations.validateAttribute(...arguments);
    };

    const destroySuper = DecoratedClass.prototype.destroy;
    DecoratedClass.prototype.destroy = function () {
      destroySuper?.call(this, ...arguments);
      this.validations.destroy();
    };

    const caches = new WeakMap();
    Object.defineProperty(DecoratedClass.prototype, 'validations', {
      get() {
        if (!caches.has(this)) {
          caches.set(
            this,
            createCache(() => {
              return new this.__VALIDATIONS_CLASS__(this);
            })
          );
        }

        return getValue(caches.get(this));
      },
    });

    Object.defineProperty(DecoratedClass.prototype, '__VALIDATIONS_CLASS__', {
      get() {
        if (!ValidationsClass) {
          ValidationsClass = createValidationsClass(
            Object.getPrototypeOf(this)?.__VALIDATIONS_CLASS__,
            validations
          );
        }
        return ValidationsClass;
      },
    });
  };
}

/**
 * Validation rules can be created with default and global options
 * {
 *   description: 'Username',
 *   validators: [...]
 * }
 *
 * This method generate the default options pojo, applies it to each validation rule, and flattens the object
 *
 * @method normalizeOptions
 * @private
 * @param  {Object} validations
 * @return
 */
function normalizeOptions(validations = {}, globalOptions = {}) {
  Object.keys(validations).forEach((attribute) => {
    let rules = validations[attribute];

    if (rules && typeof rules === 'object' && isArray(rules.validators)) {
      let options = Object.keys(rules).reduce((o, k) => {
        if (k !== 'validators') {
          const descriptor = Object.getOwnPropertyDescriptor(rules, k);
          Object.defineProperty(o, k, descriptor);
        }
        return o;
      }, {});

      let { validators } = rules;
      validators.forEach((v) => {
        v.defaultOptions = options;
      });
      validations[attribute] = validators;
    }
    validations[attribute] = makeArray(validations[attribute]);
    validations[attribute].forEach((v) => {
      v.globalOptions = globalOptions;
    });
  });
}

/**
 * Creates the validations class that will become `model.validations`.
 *   - Setup parent validation inheritance
 *   - Merge normalized validations with parent
 *   - Create global CPs (i.e. 'isValid', 'messages', etc...)
 *
 * @method createValidationsClass
 * @private
 * @param  {Object} inheritedValidationsClass
 * @param  {Object} validations
 * @return {Ember.Object}
 */
function createValidationsClass(inheritedValidationsClass, validations) {
  let validationRules = {};
  let validatableAttributes = Object.keys(validations);

  // Setup validation inheritance
  if (
    inheritedValidationsClass &&
    inheritedValidationsClass.__IS_VALIDATIONS_CLASS__
  ) {
    let inheritedValidations = new inheritedValidationsClass();

    validationRules = Object.assign(
      validationRules,
      inheritedValidations._validationRules
    );
    validatableAttributes = emberArray(
      inheritedValidations.validatableAttributes.concat(validatableAttributes)
    ).uniq();
  }

  Object.keys(validations).forEach((key) => {
    validationRules[key] = validations[key];
  });

  // Create the `attrs` class which will add the current model reference once instantiated
  let AttrsClass = createAttrsClass(validatableAttributes);

  return class ValidationsClass {
    static __IS_VALIDATIONS_CLASS__ = true;

    @tracked model;
    @tracked attrs;

    // Caches
    _validators = {};

    // Private
    _validationRules = validationRules;

    validate = validate;
    validateAttribute = validateAttribute;
    validatableAttributes = validatableAttributes;

    get isValidations() {
      return true;
    }

    get isValid() {
      return this.__ATTRS_RESULT_COLLECTION__.isValid;
    }

    get isInvalid() {
      return this.__ATTRS_RESULT_COLLECTION__.isInvalid;
    }

    get isTruelyValid() {
      return this.__ATTRS_RESULT_COLLECTION__.isValid;
    }

    get isTruelyInvalid() {
      return this.__ATTRS_RESULT_COLLECTION__.isInvalid;
    }

    get hasWarnings() {
      return this.__ATTRS_RESULT_COLLECTION__.hasWarnings;
    }

    get messages() {
      return this.__ATTRS_RESULT_COLLECTION__.messages;
    }

    get message() {
      return this.__ATTRS_RESULT_COLLECTION__.message;
    }

    get warningMessage() {
      return this.__ATTRS_RESULT_COLLECTION__.warningMessage;
    }

    get warningMessages() {
      return this.__ATTRS_RESULT_COLLECTION__.warningMessages;
    }

    get warnings() {
      return this.__ATTRS_RESULT_COLLECTION__.warnings;
    }

    get warning() {
      return this.__ATTRS_RESULT_COLLECTION__.warning;
    }

    get errors() {
      return this.__ATTRS_RESULT_COLLECTION__.errors;
    }

    get error() {
      return this.__ATTRS_RESULT_COLLECTION__.error;
    }

    @cached
    get __ATTRS_RESULT_COLLECTION__() {
      return ResultCollection.create({
        attribute: `Model:${this}`,
        content: validatableAttributes.map((attr) => this.attrs[attr]),
      });
    }

    constructor(model) {
      Object.assign(this, {
        model,
        attrs: AttrsClass.create({
          __ATTRS_MODEL__: model,
        }),
      });
    }

    destroy() {
      // Initiate attrs destroy to cleanup any remaining model references
      this.attrs.destroy();
    }
  };
}

/**
 * Creates the `attrs` class which holds all the CP logic
 *
 * ```javascript
 * model.get('validations.attrs.username');
 * model.get('validations.attrs.nested.object.attribute');
 * ```
 *
 * @method createAttrsClass
 * @private
 * @param  {Object} validatableAttributes
 * @return {Ember.Object}
 */
function createAttrsClass(validatableAttributes) {
  let nestedClasses = {};
  let rootPath = 'root';

  class AttrsClass {
    @tracked __ATTRS_MODEL__;
    @tracked __ATTRS_PATH__ = rootPath;

    static create(props) {
      return new AttrsClass(props);
    }

    constructor(props = {}) {
      Object.assign(this, props);

      let model = this.__ATTRS_MODEL__;
      let path = this.__ATTRS_PATH__;

      // Instantiate the nested attrs classes for the current path
      Object.keys(nestedClasses[path] ?? []).forEach((key) => {
        this[key] = nestedClasses[path][key].create({ __ATTRS_MODEL__: model });
      });
    }

    destroy() {
      this.__ATTRS_MODEL__ = null;

      // Destroy all nested classes
      Object.keys(nestedClasses[this.__ATTRS_PATH__] ?? {}).forEach((key) => {
        this[key].destroy();
      });
    }
  }

  /*
    Insert CPs + Create nested classes
   */
  validatableAttributes.forEach((attribute) => {
    const caches = new WeakMap();

    Object.defineProperty(AttrsClass.prototype, attribute, {
      get() {
        if (!caches.has(this)) {
          caches.set(
            this,
            createCache(() => {
              let model = this.__ATTRS_MODEL__;
              let validators = !isNone(model)
                ? getValidatorsFor(attribute, model)
                : [];

              const validationResults = generateValidationResultsFor(
                attribute,
                model,
                validators,
                (validator, options) =>
                  validator.validate(
                    validator.getValue(),
                    options,
                    model,
                    attribute
                  )
              );

              return ResultCollection.create({
                attribute,
                content: validationResults,
              });
            })
          );
        }

        return getValue(caches.get(this));
      },
    });
  });

  return AttrsClass;
}

/**
 * Generates the validation results for a given attribute and validators. If a
 * given validator should be validated, it calls upon the validate callback to retrieve
 * the result.
 *
 * @method generateValidationResultsFor
 * @private
 * @param  {String} attribute
 * @param  {Object} model
 * @param  {Array} validators
 * @param  {Function} validate
 * @return {Array}
 */
function generateValidationResultsFor(attribute, model, validators, validate) {
  let isModelValidatable = isValidatable(model);
  let isInvalid = false;
  let value, result;

  return validators.map((validator) => {
    let options = validator.options.toObject();
    let isWarning = options.isWarning ?? false;
    let disabled = options.disabled ?? false;

    if (disabled || isInvalid || !isModelValidatable) {
      value = true;
    } else {
      value = validate(validator, options);
    }

    result = validationReturnValueHandler(attribute, value, model, validator);

    /*
      If the current result is invalid, the rest of the validations do not need to be
      triggered since the attribute is already in an invalid state.
     */
    if (!isInvalid && !isWarning && result.isInvalid) {
      isInvalid = true;
    }

    return result;
  });
}

/**
 * A handler used to create ValidationResult object from values returned from a validator
 *
 * @method validationReturnValueHandler
 * @private
 * @param  {String} attribute
 * @param  {Mixed} value
 * @param  {Object} model
 * @return {ValidationResult}
 */
function validationReturnValueHandler(attribute, value, model, validator) {
  const result = ValidationResult.create({
    model,
    attribute,
    _validator: validator,
  });
  result.update(value);
  return result;
}

/**
 * Get validators for the give attribute. If they are not in the cache, then create them.
 *
 * @method getValidatorsFor
 * @private
 * @param  {String} attribute
 * @param  {Object} model
 * @return {Array}
 */
function getValidatorsFor(attribute, model) {
  let validators = model.validations?._validators?.[attribute];
  return isNone(validators)
    ? createValidatorsFor(attribute, model)
    : validators;
}

/**
 * Create validators for the give attribute and store them in a cache
 *
 * @method createValidatorsFor
 * @private
 * @param  {String} attribute
 * @param  {Object} model
 * @return {Array}
 */
function createValidatorsFor(attribute, model) {
  let validations = model.validations;
  let validationRules = makeArray(validations._validationRules[attribute]);
  let validatorCache = validations._validators;
  let owner = getOwner(model);
  let validators = [];

  // We must have an owner to be able to lookup our validators
  if (isNone(owner)) {
    throw new TypeError(
      `[@eflexsystems/ember-tracked-validations] ${model.toString()} is missing a container or owner.`
    );
  }

  validationRules.forEach((v) => {
    v.attribute = attribute;
    v.model = model;
    validators.push(lookupValidator(owner, v._type).create(v));
  });

  // Add validators to model instance cache
  validatorCache[attribute] = validators;

  return validators;
}

/**
 * ```javascript
 * const { model, validations } = model.validate({ on: ['username', 'email'] })
 * validations.isValid; // true or false
 *
 * let usernameValidations = model.validations.attrs.username;
 * usernameValidations.isValid // true or false
 * });
 * ```
 *
 * @method validate
 * @param  {Object} options
 * @param  {Array} options.on Only validate the given attributes. If empty, will validate over all validatable attribute
 * @param  {Array} options.excludes Exclude validation on the given attributes
 * @return {Object}
 */
function validate(options = {}) {
  let model = this.model;
  let whiteList = makeArray(options.on);
  let blackList = makeArray(options.excludes);

  let validationResults = this.validatableAttributes.reduce((v, name) => {
    if (!isEmpty(blackList) && blackList.indexOf(name) !== -1) {
      return v;
    }

    if (isEmpty(whiteList) || whiteList.indexOf(name) !== -1) {
      v.push(this.attrs[name]);
    }

    return v;
  }, []);

  let validations = ResultCollection.create({
    attribute: `Validate:${model}`,
    content: validationResults,
  });

  return { model, validations };
}

/**
 * A functional approach to check if a given attribute on a model is valid independently of the
 * model attribute's validations. This method returns a {{#crossLink "ResultCollection"}}{{/crossLink}}.
 *
 * ```javascript
 * const { validations } = model.validateAttribute('username', 'offirgolan');
 * validations.isValid; // true or false
 * ```
 *
 * @method validateAttribute
 * @param  {String} attribute
 * @param  {Mixed} value
 * @return {Object}
 */
function validateAttribute(attribute, value) {
  let model = this.model;
  let validators = !isNone(model) ? getValidatorsFor(attribute, model) : [];

  let validationResults = generateValidationResultsFor(
    attribute,
    model,
    validators,
    (validator, options) => validator.validate(value, options, model, attribute)
  );

  let validations = ResultCollection.create({
    attribute,
    content: validationResults?.flat(Infinity),
  });

  return { model, validations };
}
