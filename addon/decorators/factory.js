import { Promise } from 'rsvp';
import { A as emberArray, makeArray, isArray } from '@ember/array';
import { assign } from '@ember/polyfills';
import { cancel, debounce } from '@ember/runloop';
import { guidFor } from '@ember/object/internals';
import { isEmpty, isNone } from '@ember/utils';
import { getOwner } from '@ember/application';
import ValidationResult from '../-private/result';
import ResultCollection from '../validations/result-collection';
import shouldCallSuper from '../utils/should-call-super';
import lookupValidator from '../utils/lookup-validator';
import { isValidatable, isPromise } from '../utils/utils';
import { tracked } from '@glimmer/tracking';

const VALIDATION_COUNT_MAP = new WeakMap();

/**
 * ## Running Manual Validations
 *
 * Although validations are lazily computed, there are times where we might want to force all or
 * specific validations to happen. For this reason we have exposed three methods:
 *
 * - {{#crossLink "Factory/validate:method"}}{{/crossLink}}: Will always return a promise and should be used if asynchronous validations are present
 * - {{#crossLink "Factory/validateSync:method"}}{{/crossLink}}: Should only be used if all validations are synchronous. It will throw an error if any of the validations are asynchronous
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
 * @return {Ember.Mixin}
 */
export default function buildValidations(validations = {}, globalOptions = {}) {
  return function (DecoratedClass) {
    normalizeOptions(validations, globalOptions);
    let Validations, validationMixinCount;

    return class ValidatedClass extends DecoratedClass {
      constructor() {
        super(...arguments);

        // Count number of mixins to bypass super check if there is more than 1
        validationMixinCount = (VALIDATION_COUNT_MAP.get(this) || 0) + 1;
        VALIDATION_COUNT_MAP.set(this, validationMixinCount);
      }

      get __VALIDATIONS_CLASS__() {
        if (!Validations) {
          let inheritedClass;

          if (
            shouldCallSuper(this, '__VALIDATIONS_CLASS__') ||
            validationMixinCount > 1
          ) {
            inheritedClass = Object.getPrototypeOf(this.constructor);
          }

          Validations = createValidationsClass(inheritedClass, validations);
        }
        return Validations;
      }

      get validations() {
        return this.__VALIDATIONS_CLASS__.create({ model: this });
      }

      validate() {
        return this.validations.validate(...arguments);
      }

      validateSync() {
        return this.validations.validateSync(...arguments);
      }

      validateAttribute() {
        return this.validations.validateAttribute(...arguments);
      }

      destroy() {
        super.destroy(...arguments);
        this.validations.destroy();
      }
    };
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
  let validatableAttrs = Object.keys(validations);

  validatableAttrs.forEach((attribute) => {
    let rules = validations[attribute];

    if (rules && typeof rules === 'object' && isArray(rules.validators)) {
      let options = Object.keys(rules).reduce((o, k) => {
        if (k !== 'validators') {
          o[k] = rules[k];
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
    let inheritedValidations = inheritedValidationsClass.create();

    validationRules = assign(
      validationRules,
      inheritedValidations.get('_validationRules')
    );
    validatableAttributes = emberArray(
      inheritedValidations
        .get('validatableAttributes')
        .concat(validatableAttributes)
    ).uniq();
  }

  validatableAttributes.forEach((key) => {
    validationRules[key] = validations[key];
  });

  // Create the `attrs` class which will add the current model reference once instantiated
  let AttrsClass = createAttrsClass(validatableAttributes);

  // Create `validations` class
  return class ValidationsClass {
    static __IS_VALIDATIONS_CLASS__ = true;

    @tracked model;
    @tracked attrs;

    // Caches
    _validators = {};
    _debouncedValidations = {};

    // Private
    _validationRules = validationRules;

    validate = validate;
    validateSync = validateSync;
    validateAttribute = validateAttribute;
    validatableAttributes = validatableAttributes;

    get isValidations() {
      return true;
    }

    get isValid() {
      return this.__ATTRS_RESULT_COLLECTION__.isValid;
    }

    get isValidating() {
      return this.__ATTRS_RESULT_COLLECTION__.isValidating;
    }

    get isAsync() {
      return this.__ATTRS_RESULT_COLLECTION__.isAsync;
    }

    get isNotValidating() {
      return this.__ATTRS_RESULT_COLLECTION__.isNotValidating;
    }

    get isInvalid() {
      return this.__ATTRS_RESULT_COLLECTION__.isInvalid;
    }

    get isTruelyValid() {
      return this.__ATTRS_RESULT_COLLECTION__.isTruelyValid;
    }

    get isTruelyInvalid() {
      return this.__ATTRS_RESULT_COLLECTION__.isTruelyInvalid;
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

    get _promise() {
      return this.__ATTRS_RESULT_COLLECTION__._promise;
    }

    get __ATTRS_RESULT_COLLECTION__() {
      return ResultCollection.create({
        attribute: `Model:${this}`,
        content: validatableAttributes.map((attr) => this.attrs[attr]),
      });
    }

    static create(props) {
      return new ValidationsClass(props);
    }

    constructor(props = {}) {
      Object.assign(this, props, {
        attrs: AttrsClass.create({
          __ATTRS_MODEL__: props.model,
        }),
      });
    }

    destroy() {
      let validatableAttrs = this.validatableAttributes;
      let debouncedValidations = this._debouncedValidations;

      // Initiate attrs destroy to cleanup any remaining model references
      this.attrs.destroy();

      // Cancel all debounced timers
      validatableAttrs.forEach((attr) => {
        let attrCache = debouncedValidations[attr];

        if (!isNone(attrCache)) {
          // Itterate over each attribute and cancel all of its debounced validations
          Object.keys(attrCache).forEach((v) => cancel(attrCache[v]));
        }
      });
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
    let currClass = AttrsClass;

    Object.defineProperty(currClass.prototype, attribute, {
      get() {
        let model = this.__ATTRS_MODEL__;
        let validators = !isNone(model)
          ? getValidatorsFor(attribute, model)
          : [];

        let validationResults = generateValidationResultsFor(
          attribute,
          model,
          validators,
          (validator, options) => {
            return validator.validate(
              validator.getValue(),
              options,
              model,
              attribute
            );
          }
        );

        return ResultCollection.create({
          attribute,
          content: validationResults,
        });
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
 * @param  {Object} opts
 *                    - disableDebounceCache {Boolean}
 * @return {Array}
 */
function generateValidationResultsFor(
  attribute,
  model,
  validators,
  validate,
  opts = {}
) {
  let isModelValidatable = isValidatable(model);
  let isInvalid = false;
  let value, result;

  return validators.map((validator) => {
    let options = validator.options.toObject();
    let isWarning = options.isWarning ?? false;
    let disabled = options.disabled ?? false;
    let debounceOption = options.debounce ?? 0;
    let lazy = options.lazy ?? true;

    if (disabled || (lazy && isInvalid) || !isModelValidatable) {
      value = true;
    } else if (debounceOption > 0) {
      let cache = getDebouncedValidationsCacheFor(attribute, model);

      // Return a promise and pass the resolve method to the debounce handler
      value = new Promise((resolve) => {
        let t = debounce(validator, resolveDebounce, resolve, debounceOption);

        if (!opts.disableDebounceCache) {
          cache[guidFor(validator)] = t;
        }
      }).then(() => {
        return validate(validator, validator.options.toObject());
      });
    } else {
      value = validate(validator, options);
    }

    result = validationReturnValueHandler(attribute, value, model, validator);

    /*
      If the current result is invalid, the rest of the validations do not need to be
      triggered (if lazy) since the attribute is already in an invalid state.
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
  let result;

  let commonProps = {
    model,
    attribute,
    _validator: validator,
  };

  if (isPromise(value)) {
    result = ValidationResult.create(commonProps, {
      _promise: Promise.resolve(value),
    });
  } else {
    result = ValidationResult.create(commonProps);
    result.update(value);
  }

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
 * Get debounced validation cache for the given attribute. If it doesn't exist, create a new one.
 *
 * @method getValidatorCacheFor
 * @private
 * @param  {String} attribute
 * @param  {Object} model
 * @return {Map}
 */
function getDebouncedValidationsCacheFor(attribute, model) {
  let debouncedValidations = model.validations._debouncedValidations;

  if (isNone(debouncedValidations[attribute])) {
    debouncedValidations[attribute] = {};
  }

  return debouncedValidations[attribute];
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
      `[ember-cp-validations] ${model.toString()} is missing a container or owner.`
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
 * Call the passed resolve method. This is needed as run.debounce expects a
 * static method to work properly.
 *
 * @method resolveDebounce
 * @private
 * @param  {Function} resolve
 */
function resolveDebounce(resolve) {
  resolve();
}

/**
 * ```javascript
 * model.validate({ on: ['username', 'email'] }).then(({ m, validations }) => {
 *   validations.get('isValid'); // true or false
 *   validations.get('isValidating'); // false
 *
 *   let usernameValidations = m.get('validations.attrs.username');
 *   usernameValidations.get('isValid') // true or false
 * });
 * ```
 *
 * @method validate
 * @param  {Object} options
 * @param  {Array} options.on Only validate the given attributes. If empty, will validate over all validatable attribute
 * @param  {Array} options.excludes Exclude validation on the given attributes
 * @param  {Boolean} isAsync      If `false`, will get all validations and will error if an async validations is found.
 *                              If `true`, will get all validations and wrap them in a promise hash
 * @return {Promise or Object}  Promise if isAsync is true, object if isAsync is false
 */
function validate(options = {}, isAsync = true) {
  let model = this.model;
  let whiteList = makeArray(options.on);
  let blackList = makeArray(options.excludes);

  let validationResults = this.validatableAttributes.reduce((v, name) => {
    if (!isEmpty(blackList) && blackList.indexOf(name) !== -1) {
      return v;
    }

    if (isEmpty(whiteList) || whiteList.indexOf(name) !== -1) {
      let validationResult = this.attrs[name];

      // If an async validation is found, throw an error
      if (!isAsync && validationResult.isAsync) {
        throw new Error(
          `[ember-cp-validations] Synchronous validation failed due to ${name} being an async validation.`
        );
      }

      v.push(validationResult);
    }

    return v;
  }, []);

  let validations = ResultCollection.create({
    attribute: `Validate:${model}`,
    content: validationResults,
  });

  let resultObject = { model, validations };

  if (isAsync) {
    return Promise.resolve(validations._promise).then(() => {
      /*
        NOTE: When dealing with belongsTo and hasMany relationships, there are cases
        where we have to resolve the actual models and only then resolve all the underlying
        validation promises. This is the reason that `validate` must be called recursively.
       */
      return validations.isValidating
        ? this.validate(options, isAsync)
        : resultObject;
    });
  }

  return resultObject;
}

/**
 * A functional approach to check if a given attribute on a model is valid independently of the
 * model attribute's validations. This method will always return a promise which will then resolve
 * to a {{#crossLink "ResultCollection"}}{{/crossLink}}.
 *
 * ```javascript
 * model.validateAttribute('username', 'offirgolan').then(({ m, validations }) => {
 *   validations.get('isValid'); // true or false
 *   validations.get('isValidating'); // false
 * });
 * ```
 *
 * @method validateAttribute
 * @param  {String}   attribute
 * @param  {Mixed}  value
 * @return {Promise}
 * @async
 */
function validateAttribute(attribute, value) {
  let model = this.model;
  let validators = !isNone(model) ? getValidatorsFor(attribute, model) : [];

  let validationResults = generateValidationResultsFor(
    attribute,
    model,
    validators,
    (validator, options) => {
      return validator.validate(value, options, model, attribute);
    },
    {
      disableDebounceCache: true,
    }
  );

  let validations = ResultCollection.create({
    attribute,
    content: validationResults?.flat(Infinity),
  });

  let result = { model, validations };

  return Promise.resolve(validations._promise).then(() => {
    /*
      NOTE: When dealing with belongsTo and hasMany relationships, there are cases
      where we have to resolve the actual models and only then resolve all the underlying
      validation promises. This is the reason that `validateAttribute` must be called recursively.
     */
    return validations.isValidating
      ? this.validateAttribute(attribute, value)
      : result;
  });
}

/**
 * ```javascript
 * let { m, validations } = model.validateSync();
 * validations.get('isValid') // true or false
 * ```
 *
 * @method validateSync
 * @param  {Object}  options
 * @param  {Array} options.on Only validate the given attributes. If empty, will validate over all validatable attribute
 * @param  {Array} options.excludes Exclude validation on the given attributes
 * @return {Object}
 */
function validateSync(options) {
  return this.validate(options, false);
}
