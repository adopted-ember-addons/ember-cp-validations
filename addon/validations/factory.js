/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import getOwner from 'ember-getowner-polyfill';
import flatten from '../utils/flatten';
import assign from '../utils/assign';
import ValidationResult from './result';
import ValidationResultCollection from './result-collection';
import BaseValidator from '../validators/base';
import cycleBreaker from '../utils/cycle-breaker';
import shouldCallSuper from '../utils/should-call-super';

const {
  get,
  set,
  run,
  RSVP,
  isNone,
  guidFor,
  isEmpty,
  isArray,
  computed,
  makeArray,
  canInvoke,
  getWithDefault,
  A: emberArray
} = Ember;

const merge = Ember.assign || Ember.merge;

const {
  Promise
} = RSVP;

const {
  and,
  or,
  not
} = computed;

/**
 * ## Running Manual Validations
 *
 * Although validations are lazily computed, there are times where we might want to force all or
 * specific validations to happen. For this reason we have exposed two methods:
 * - {{#crossLink "Factory/validateSync:method"}}{{/crossLink}}: Should only be used if all validations are synchronous. It will throw an error if any of the validations are asynchronous
 * - {{#crossLink "Factory/validate:method"}}{{/crossLink}}: Will always return a promise and should be used if asynchronous validations are present
 *
 * ## Inspecting Validations
 *
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
 *
 * @module Validations
 * @main Validations
 * @class Factory
 */

/**
 * Top level method that will ultimately return a mixin with all CP validations
 * @method  buildValidations
 * @param  {Object} validations  Validation rules
 * @return {Ember.Mixin}
 */
export
default

function buildValidations(validations = {}, globalOptions = {}) {
  normalizeOptions(validations, globalOptions);

  let Validations, validationMixinCount;

  return Ember.Mixin.create({
    init() {
      this._super(...arguments);

      // Count number of mixins to bypass super check if there is more than 1
      this.__validationsMixinCount__ = this.__validationsMixinCount__ || 0;
      validationMixinCount = ++this.__validationsMixinCount__;
    },
    __validationsClass__: computed(function () {
      if (!Validations) {
        let inheritedClass;
        if(shouldCallSuper(this, '__validationsClass__') || validationMixinCount > 1) {
          inheritedClass = this._super();
        }

        Validations = createValidationsClass(inheritedClass, validations, getOwner(this));
      }
      return Validations;
    }).readOnly(),
    validations: computed(function () {
      return this.get('__validationsClass__').create({
        model: this
      });
    }).readOnly(),
    validate() {
      return get(this, 'validations').validate(...arguments);
    },
    validateSync() {
      return get(this, 'validations').validateSync(...arguments);
    },
    destroy() {
      this._super(...arguments);
      get(this, 'validations').destroy();
    }
  });
}

/**
 * Validation rules can be created with default and global options
 * {
 *   description: 'Username',
 *   validators: [...]
 * }
 * This method generate the default options pojo, applies it to each validation rule, and flattens the object
 * @method normalizeOptions
 * @private
 * @param  {Object} validations
 * @return
 */
function normalizeOptions(validations = {}, globalOptions = {}) {
  const validatableAttrs = Object.keys(validations);

  validatableAttrs.forEach(attribute => {
    const rules = validations[attribute];

    if (rules && typeof rules === 'object' && isArray(rules.validators)) {
      const options = Object.keys(rules).reduce((o, k) => {
        if (k !== 'validators') {
          o[k] = rules[k];
        }
        return o;
      }, {});

      const validators = rules.validators;

      validators.forEach(v => {
        v.defaultOptions = options;
      });
      validations[attribute] = validators;
    }
    validations[attribute] = makeArray(validations[attribute]);
    validations[attribute].forEach(v => {
      v.globalOptions = globalOptions;
    });
  });
}

/**
 * Creates the validations class that will become `model.validations`.
 *   - Setup parent validation inheritance
 *   - Normalize nested keys (i.e. 'details.dob') into objects (i.e { details: { dob: validator() }})
 *   - Merge normalized validations with parent
 *   - Create global CPs (i.e. 'isValid', 'messages', etc...)
 *
 * @method createValidationsClass
 * @private
 * @param  {Object} inheritedValidationsClass
 * @param  {Object} validations
 * @param  {Object} owner
 * @return {Ember.Object}
 */
function createValidationsClass(inheritedValidationsClass, validations, owner) {
  let validationRules = {};
  let validatableAttributes = Object.keys(validations);

  // Setup validation inheritance
  if (inheritedValidationsClass && inheritedValidationsClass.__isCPValidationsClass__) {
    const inheritedValidations = inheritedValidationsClass.create();

    validationRules = merge(validationRules, inheritedValidations.get('_validationRules'));
    validatableAttributes = emberArray(inheritedValidations.get('validatableAttributes').concat(validatableAttributes)).uniq();
  }

  // Normalize nested keys into actual objects and merge them with parent object
  Object.keys(validations).reduce((obj, key) => {
    assign(obj, key, validations[key]);
    return obj;
  }, validationRules);

  // Create the mixin that holds all the top level validation props (isValid, messages, etc)
  const TopLevelProps = createTopLevelPropsMixin(validatableAttributes);

  // Create the `attrs` class which will add the current model reference once instantiated
  const AttrsClass = createAttrsClass(validatableAttributes, validationRules, owner);

  // Create `validations` class
  const ValidationsClass = Ember.Object.extend(TopLevelProps, {
    model: null,
    attrs: null,
    isValidations: true,

    validatableAttributes: computed(function () {
      return validatableAttributes;
    }).readOnly(),

    // Caches
    _validators: null,
    _debouncedValidations: null,

    // Private
    _validationRules: computed(function () {
      return validationRules;
    }).readOnly(),

    validate,
    validateSync,

    init() {
      this._super(...arguments);
      this.setProperties({
        attrs: AttrsClass.create({
          _model: this.get('model')
        }),
        _validators: {},
        _debouncedValidations: {}
      });
    },

    destroy() {
      this._super(...arguments);
      const validatableAttrs = get(this, 'validatableAttributes');
      const debouncedValidations = get(this, '_debouncedValidations');

      // Initiate attrs destroy to cleanup any remaining model references
      this.get('attrs').destroy();

      // Cancel all debounced timers
      validatableAttrs.forEach(attr => {
        const attrCache = get(debouncedValidations, attr);

        if (!isNone(attrCache)) {
          // Itterate over each attribute and cancel all of its debounced validations
          Object.keys(attrCache).forEach(v => run.cancel(attrCache[v]));
        }
      });
    }
  });

  ValidationsClass.reopenClass({
    __isCPValidationsClass__: true
  });

  return ValidationsClass;
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
 * @param  {Object} validationRules
 * @param  {Object} owner
 * @return {Ember.Object}
 */
function createAttrsClass(validatableAttributes, validationRules, owner) {
  return Ember.Object.extend({
    init() {
      this._super(...arguments);
      const model = this.get('_model');

      // Create the CPs
      validatableAttributes.forEach(attribute => {
        const cp = createCPValidationFor(attribute, get(validationRules, attribute), owner);
        assign(this, attribute, cp, true);
      });

      validatableAttributes.forEach(attribute => {
        // Add a reference to the model in the deepest object
        const path = attribute.split('.');
        const lastObject = get(this, path.slice(0, path.length - 1).join('.'));

        if (isNone(get(lastObject, '_model'))) {
          set(lastObject, '_model', model);
        }
      });
    },

    destroy() {
      this._super(...arguments);
      validatableAttributes.forEach(attribute => {
        // Remove model reference from nested objects
        const path = attribute.split('.');
        const lastObject = get(this, path.slice(0, path.length - 1).join('.'));

        if (!isNone(get(lastObject, '_model'))) {
          set(lastObject, '_model', null);
        }
      });
    }
  });
}

/**
 * CP generator for the given attribute
 * @method createCPValidationFor
 * @private
 * @param  {String} attribute
 * @param  {Array / Object} validations
 * @return {Ember.computed} A computed property which is a ValidationResultCollection
 */
function createCPValidationFor(attribute, validations, owner) {
  const dependentKeys = getCPDependentKeysFor(attribute, validations, owner);

  return computed(...dependentKeys, cycleBreaker(function () {
    const model = get(this, '_model');
    const validators = !isNone(model) ? getValidatorsFor(attribute, model) : [];

    const validationResults = validators.map(validator => {
      const options = validator.processOptions();
      const debounce = getWithDefault(options, 'debounce', 0);
      const disabled = getWithDefault(options, 'disabled', false);
      let value;

      if (disabled) {
        value = true;
      } else if (debounce > 0) {
        const cache = getDebouncedValidationsCacheFor(attribute, model);

        // Return a promise and pass the resolve method to the debounce handler
        value = new Promise(resolve => {
          cache[guidFor(validator)] = run.debounce(validator, debouncedValidate, validator, model, attribute, resolve, debounce, false);
        });
      } else {
        value = validator.validate(validator.getValue(), options, model, attribute);
      }

      return validationReturnValueHandler(attribute, value, model, validator);
    });

    return ValidationResultCollection.create({
      attribute,
      content: flatten(validationResults)
    });
  })).readOnly();
}

/**
 * Create a mixin that will have all the top level CPs under the validations object.
 * These are computed collections on different properties of each attribute validations CP
 *
 * @method createTopLevelPropsMixin
 * @private
 * @param  {Object} validations
 */
function createTopLevelPropsMixin(validatableAttrs) {
  return Ember.Mixin.create({
    isValid: and(...validatableAttrs.map(attr => `attrs.${attr}.isValid`)).readOnly(),
    isValidating: or(...validatableAttrs.map(attr => `attrs.${attr}.isValidating`)).readOnly(),
    isDirty: or(...validatableAttrs.map(attr => `attrs.${attr}.isDirty`)).readOnly(),
    isAsync: or(...validatableAttrs.map(attr => `attrs.${attr}.isAsync`)).readOnly(),
    isNotValidating: not('isValidating').readOnly(),
    isInvalid: not('isValid').readOnly(),
    isTruelyValid: and('isValid', 'isNotValidating').readOnly(),

    messages: computed(...validatableAttrs.map(attr => `attrs.${attr}.messages`), function () {
      return emberArray(flatten(validatableAttrs.map(attr => get(this, `attrs.${attr}.messages`)))).compact();
    }).readOnly(),

    message: computed('messages.[]', cycleBreaker(function () {
      return get(this, 'messages.0');
    })).readOnly(),

    errors: computed(...validatableAttrs.map(attr => `attrs.${attr}.@each.errors`), function () {
      return emberArray(flatten(validatableAttrs.map(attr => get(this, `attrs.${attr}.errors`)))).compact();
    }).readOnly(),

    error: computed('errors.[]', cycleBreaker(function () {
      return get(this, 'errors.0');
    })).readOnly(),

    _promise: computed(...validatableAttrs.map(attr => `attrs.${attr}._promise`), function () {
      const promises = [];

      validatableAttrs.forEach(attr => {
        const validation = get(this, `attrs.${attr}`);

        if (get(validation, 'isAsync')) {
          promises.push(get(validation, '_promise'));
        }
      });
      return RSVP.Promise.all(flatten(promises));
    }).readOnly()
  });
}

/**
 * CP dependency generator for a give attribute depending on its relationships
 * @method getCPDependentKeysFor
 * @private
 * @param  {String} attribute
 * @param  {Array / Object} validations
 * @return {Array} Unique list of dependencies
 */
function getCPDependentKeysFor(attribute, validations, owner) {
  let dependentKeys = validations.map(validation => {
    const type = validation._type;
    const options = validation.options;
    const Validator = type === 'function' ? BaseValidator : lookupValidator(owner, type);
    const baseDependents = BaseValidator.getDependentsFor(attribute, options) || [];
    const dependents = Validator.getDependentsFor(attribute, options) || [];

    const specifiedDependents = [].concat(
      getWithDefault(options, 'dependentKeys', []),
      getWithDefault(validation, 'defaultOptions.dependentKeys', []),
      getWithDefault(validation, 'globalOptions.dependentKeys', [])
    );

    return baseDependents.concat(
      dependents,
      specifiedDependents.map(d => `_model.${d}`)
    );
  });

  dependentKeys = flatten(dependentKeys);
  dependentKeys.push(`_model.${attribute}`);

  return emberArray(dependentKeys).uniq();
}

/**
 * Debounce handler for running a validation for the specified options
 * @method debouncedValidate
 * @private
 * @param  {Validator} validator
 * @param  {Unknown} value
 * @param  {Object} options
 * @param  {Object} model
 * @param  {String} attribute
 * @param  {Function} resolve
 */
function debouncedValidate(validator, model, attribute, resolve) {
  const options = validator.processOptions();
  const value = validator.getValue();

  resolve(validator.validate(value, options, model, attribute));
}

/**
 * A handler used to create ValidationResult object from values returned from a validator
 * @method validationReturnValueHandler
 * @private
 * @param  {String} attribute
 * @param  {Unknown} value
 * @param  {Object} model
 * @return {ValidationResult}
 */
function validationReturnValueHandler(attribute, value, model, validator) {
  let result;

  if (canInvoke(value, 'then')) {
    result = ValidationResult.create({
      attribute,
      _promise: Promise.resolve(value),
      model,
      _validator: validator
    });
  } else {
    result = ValidationResult.create({
      attribute,
      model,
      _validator: validator
    });
    result.update(value);
  }

  return result;
}

/**
 * Get validators for the give attribute. If they are not in the cache, then create them.
 * @method getValidatorsFor
 * @private
 * @param  {String} attribute
 * @param  {Object} model
 * @return {Array}
 */
function getValidatorsFor(attribute, model) {
  const validators = get(model, `validations._validators.${attribute}`);

  if (!isNone(validators)) {
    return validators;
  }

  return createValidatorsFor(attribute, model);
}

/**
 * Get debounced validation cache for the given attribute. If it doesnt exist, create a new one.
 * @method getValidatorCacheFor
 * @private
 * @param  {String} attribute
 * @param  {Object} model
 * @return {Map}
 */
function getDebouncedValidationsCacheFor(attribute, model) {
  const debouncedValidations = get(model, 'validations._debouncedValidations');

  if (isNone(get(debouncedValidations, attribute))) {
    assign(debouncedValidations, attribute, {});
  }

  return get(debouncedValidations, attribute);
}

/**
 * Create validators for the give attribute and store them in a cache
 * @method createValidatorsFor
 * @private
 * @param  {String} attribute
 * @param  {Object} model
 * @return {Array}
 */
function createValidatorsFor(attribute, model) {
  const validations = get(model, 'validations');
  const validationRules = makeArray(get(validations, `_validationRules.${attribute}`));
  const validatorCache = get(validations, '_validators');
  const owner = getOwner(model);
  const validators = [];
  let validator;

  // We must have an owner to be able to lookup our validators
  if (isNone(owner)) {
    throw new TypeError(`[ember-cp-validations] ${model.toString()} is missing a container or owner.`);
  }

  validationRules.forEach(v => {
    v.attribute = attribute;
    v.model = model;

    // If validate function exists, that means validator was created with a function so use the base class
    if (v._type === 'function') {
      validator = BaseValidator.create(owner.ownerInjection(), v);
    } else {
      validator = lookupValidator(owner, v._type).create(v);
    }
    validators.push(validator);
  });

  // Add validators to model instance cache
  assign(validatorCache, attribute, validators);

  return validators;
}

/**
 * Lookup a validators of a specific type on the owner
 * @method lookupValidator
 * @throws {Error} Validator not found
 * @private
 * @param  {Ember.Owner} owner
 * @param  {String} type
 * @return {Class} Validator class or undefined if not found
 */
function lookupValidator(owner, type) {
  const validatorClass = owner._lookupFactory(`validator:${type}`);

  if (isNone(validatorClass)) {
    throw new Error(`[ember-cp-validations] Validator not found of type: ${type}.`);
  }
  return validatorClass;
}

/**
 * ### Options
 * - `on` (**Array**): Only validate the given attributes. If empty, will validate over all validatable attribute
 * - `excludes` (**Array**): Exclude validation on the given attributes
 *
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
 * @param  {Object}  options
 * @param  {Boolean} async      If `false`, will get all validations and will error if an async validations is found.
 *                              If `true`, will get all validations and wrap them in a promise hash
 * @return {Promise or Object}  Promise if async is true, object if async is false
 */
function validate(options = {}, async = true) {
  const model = get(this, 'model');
  const whiteList = makeArray(options.on);
  const blackList = makeArray(options.excludes);

  const validationResults = get(this, 'validatableAttributes').reduce((v, name) => {
    if (!isEmpty(blackList) && blackList.indexOf(name) !== -1) {
      return v;
    }

    if (isEmpty(whiteList) || whiteList.indexOf(name) !== -1) {
      const validationResult = get(this, `attrs.${name}`);

      // If an async validation is found, throw an error
      if (!async && get(validationResult, 'isAsync')) {
        throw new Error(`[ember-cp-validations] Synchronous validation failed due to ${name} being an async validation.`);
      }

      v.push(validationResult);
    }
    return v;
  }, []);

  const validationResultsCollection = ValidationResultCollection.create({
    content: validationResults
  });

  const resultObject = {
    model,
    validations: validationResultsCollection
  };

  if (async) {
    if (get(validationResultsCollection, 'isAsync')) {
      resultObject.promise = get(validationResultsCollection, 'value');
    }
    return RSVP.hash(resultObject);
  }

  return resultObject;
}

/**
 * ### Options
 * - `on` (**Array**): Only validate the given attributes. If empty, will validate over all validatable attribute
 * - `excludes` (**Array**): Exclude validation on the given attributes
 *
 * ```javascript
 * const { m, validations } = model.validateSync();
 * validations.get('isValid') // true or false
 * ```
 * @method validateSync
 * @param  {Object}  options
 * @return {Object}
 */
function validateSync(options) {
  return this.validate(options, false);
}
