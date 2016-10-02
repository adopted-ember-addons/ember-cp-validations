/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import getOwner from 'ember-getowner-polyfill';
import flatten from '../utils/flatten';
import assign from '../utils/assign';
import ValidationResult from '../-private/result';
import ResultCollection from './result-collection';
import BaseValidator from '../validators/base';
import cycleBreaker from '../utils/cycle-breaker';
import shouldCallSuper from '../utils/should-call-super';
import { isDsModel, isValidatable, isPromise } from '../utils/utils';

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
  getWithDefault,
  A: emberArray
} = Ember;

const merge = Ember.assign || Ember.merge;

const {
  Promise
} = RSVP;

/**
 * ## Running Manual Validations
 *
 * Although validations are lazily computed, there are times where we might want to force all or
 * specific validations to happen. For this reason we have exposed three methods:
 *
 * - {{#crossLink "Factory/validateSync:method"}}{{/crossLink}}: Should only be used if all validations are synchronous. It will throw an error if any of the validations are asynchronous
 * - {{#crossLink "Factory/validate:method"}}{{/crossLink}}: Will always return a promise and should be used if asynchronous validations are present
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
export
default

function buildValidations(validations = {}, globalOptions = {}) {
  normalizeOptions(validations, globalOptions);

  let Validations, validationMixinCount;

  const ValidationsMixin = Ember.Mixin.create({
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

        Validations = createValidationsClass(inheritedClass, validations, this);
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
    validateAttribute() {
      return get(this, 'validations').validateAttribute(...arguments);
    },
    destroy() {
      this._super(...arguments);
      get(this, 'validations').destroy();
    }
  });

  // Label mixin under a named scope for Ember Inspector
  ValidationsMixin[Ember.NAME_KEY] = 'Validations';

  return ValidationsMixin;
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
 * @param  {Object} model
 * @return {Ember.Object}
 */
function createValidationsClass(inheritedValidationsClass, validations, model) {
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
  const AttrsClass = createAttrsClass(validatableAttributes, validationRules, model);

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
    validateAttribute,

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
 * @param  {Object} model
 * @return {Ember.Object}
 */
function createAttrsClass(validatableAttributes, validationRules, model) {
  const nestedClasses = {};
  const rootPath = 'root';

  const AttrsClass = Ember.Object.extend({
    __path__: rootPath,

    init() {
      this._super(...arguments);

      const _model = this.get('_model');
      const path = this.get('__path__');

      /*
        Instantiate the nested attrs classes for the current path
       */
      Object.keys(nestedClasses[path] || []).forEach(key => {
        set(this, key, nestedClasses[path][key].create({ _model }));
      });
    },

    destroy() {
      this._super(...arguments);

      const path = this.get('__path__');

      /*
        Remove the model reference from each nested class and destroy it
       */
      Object.keys(nestedClasses[path] || []).forEach(key => {
        const o = get(this, key);
        o.set('_model', null);
        o.destroy();
      });
    }
  });

  /*
    Insert CPs + Create nested classes
   */
  validatableAttributes.forEach(attribute => {
    let path = attribute.split('.');
    let attr = path.pop();
    let currPath = [rootPath];
    let currClass = AttrsClass;
    let cpHash = {};

    // Iterate over the path and create the necessary nested classes along the way
    for(let i = 0; i < path.length; i++) {
      const key = path[i];
      const currPathStr = currPath.join('.');
      let _nestedClasses;

      nestedClasses[currPathStr] = nestedClasses[currPathStr] || {};
      _nestedClasses = nestedClasses[currPathStr];

      currPath.push(key);

      if(!_nestedClasses[key]) {
        _nestedClasses[key] = AttrsClass.extend({ __path__: currPath.join('.') });
      }

      currClass = _nestedClasses[key];
    }

    // Add the final attr's CP to the class
    cpHash[attr] = createCPValidationFor(attribute, model, get(validationRules, attribute));
    currClass.reopen(cpHash);
  });

  return AttrsClass;
}

/**
 * CP generator for the given attribute
 *
 * @method createCPValidationFor
 * @private
 * @param  {String} attribute
 * @param  {Object} model         Since the CPs are created once per class on the first initialization,
 *                                this is the first model that was instantiated
 * @param  {Array} validations
 * @return {Ember.ComputedProperty} A computed property which is a ResultCollection
 */
function createCPValidationFor(attribute, model, validations) {
  const dependentKeys = getCPDependentKeysFor(attribute, model, validations);

  return computed(...dependentKeys, cycleBreaker(function () {
    const model = get(this, '_model');
    const validators = !isNone(model) ? getValidatorsFor(attribute, model) : [];

    const validationResults = generateValidationResultsFor(attribute, model, validators, (validator, options) => {
      const debounce = getWithDefault(options, 'debounce', 0);

      if (debounce > 0) {
        const cache = getDebouncedValidationsCacheFor(attribute, model);

        // Return a promise and pass the resolve method to the debounce handler
        return new Promise(resolve => {
          cache[guidFor(validator)] = run.debounce(validator, debouncedValidate, validator, model, attribute, resolve, debounce, false);
        });
      } else {
        return validator.validate(validator.getValue(), options, model, attribute);
      }
    });

    return ResultCollection.create({ attribute, content:  validationResults });
  })).readOnly();
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

  return validators.map(validator => {
    const options = get(validator, 'options').copy();
    const isWarning = getWithDefault(options, 'isWarning', false);
    const disabled = getWithDefault(options, 'disabled', false);
    const lazy = getWithDefault(options, 'lazy', true);

    if(disabled || (lazy && isInvalid) || !isModelValidatable) {
      value = true;
    } else {
      value = validate(validator, options, model, attribute);
    }

    result = validationReturnValueHandler(attribute, value, model, validator);

    /*
      If the current result is invalid, the rest of the validations do not need to be
      triggered (if lazy) since the attribute is already in an invalid state.
     */
    if(!isInvalid && !isWarning && get(result, 'isInvalid')) {
      isInvalid = true;
    }

    return result;
  });
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
  // Expose the following properties as public APIs via readOnly aliases
  const aliases = [
    'isWarning',
    'isValid',
    'isValidating',
    'isDirty',
    'isAsync',
    'isNotValidating',
    'isInvalid',
    'isTruelyValid',
    'messages',
    'message',
    'warningMessages',
    'warningMessage',
    'warnings',
    'warning',
    'errors',
    'error',
    '_promise'
  ];

  const topLevelProps = aliases.reduce((props, alias) => {
    props[alias] = computed.readOnly(`__attrsResultCollection__.${alias}`);
    return props;
  }, {});

  return Ember.Mixin.create(topLevelProps, {
    /*
      Dedupe logic by creating a top level ResultCollection for all attr's ResultCollections
     */
    __attrsResultCollection__: computed(...validatableAttrs.map(attr => `attrs.${attr}`), function () {
      return ResultCollection.create({
        content: validatableAttrs.map(attr => get(this, `attrs.${attr}`))
      });
    }).readOnly()
  });
}

/**
 * CP dependency generator for a give attribute depending on its relationships
 *
 * @method getCPDependentKeysFor
 * @private
 * @param  {String} attribute
 * @param  {Object} model         Since the CPs are created once per class on the first initialization,
 *                                this is the first model that was instantiated
 * @param  {Array} validations
 * @return {Array} Unique list of dependencies
 */
function getCPDependentKeysFor(attribute, model, validations) {
  const owner = getOwner(model);

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

    // Extract dependentKeys from option CPs
    const cpDependents = [].concat(
      extractOptionsDependentKeys(options),
      extractOptionsDependentKeys(get(validation, 'defaultOptions')),
      extractOptionsDependentKeys(get(validation, 'globalOptions'))
    );

    return baseDependents.concat(
      dependents,
      cpDependents,
      specifiedDependents
    );
  });

  dependentKeys = flatten(dependentKeys);

  dependentKeys.push(`model.${attribute}`);

  if(isDsModel(model)) {
    dependentKeys.push(`model.isDeleted`);
  }

  dependentKeys = dependentKeys.map(d => {
    return d.split('.')[0] === 'model' ? '_' + d : d;
  });

  return emberArray(dependentKeys).uniq();
}

/**
 * Extract all dependentKeys from any property that is a CP
 *
 * @method extractOptionsDependentKeys
 * @private
 * @param  {Object} options
 * @return {Array}  dependentKeys
 */
function extractOptionsDependentKeys(options) {
  if(options && typeof options === 'object') {
    return Object.keys(options).reduce((arr, key) => {
      let option = options[key];

      if(option && typeof option === 'object' && option.isDescriptor) {
        return arr.concat(option._dependentKeys || []);
      }

      return arr;
    }, []);
  }

  return [];
}

/**
 * Debounce handler for running a validation for the specified options
 *
 * @method debouncedValidate
 * @private
 * @param  {Validator} validator
 * @param  {Mixed} value
 * @param  {Object} options
 * @param  {Object} model
 * @param  {String} attribute
 * @param  {Function} resolve
 */
function debouncedValidate(validator, model, attribute, resolve) {
  const options = get(validator, 'options').copy();
  const value = validator.getValue();

  resolve(validator.validate(value, options, model, attribute));
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

  if (isPromise(value)) {
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
 *
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
 * Get debounced validation cache for the given attribute. If it doesn't exist, create a new one.
 *
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
 *
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
 *
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

  const resultCollection = ResultCollection.create({
    content: validationResults
  });

  const resultObject = {
    model,
    validations: resultCollection
  };

  if (async) {
    if (get(resultCollection, 'isAsync')) {
      return RSVP.allSettled(makeArray(get(resultCollection, '_promise'))).then(() => resultObject);
    }
    return Promise.resolve(resultObject);
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
  const model = get(this, 'model');
  const validators = !isNone(model) ? getValidatorsFor(attribute, model) : [];

  const validationResults = generateValidationResultsFor(attribute, model, validators, (validator, options) => {
    return validator.validate(value, options, model, attribute);
  });

  const validations = ResultCollection.create({
    attribute,
    content: flatten(validationResults)
  });

  const result = { model, validations };

  return Promise.resolve(get(validations, 'isAsync') ? get(validations, '_promise').then(() => result) : result);
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
 *
 * @method validateSync
 * @param  {Object}  options
 * @return {Object}
 */
function validateSync(options) {
  return this.validate(options, false);
}
