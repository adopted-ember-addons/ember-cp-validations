/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import getOwner from 'ember-getowner-polyfill';
import flatten from '../utils/flatten';
import ValidationResult from './result';
import ValidationResultCollection from './result-collection';
import BaseValidator from '../validators/base';
import cycleBreaker from '../utils/cycle-breaker';

const {
  get,
  run,
  RSVP,
  merge,
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
 * @module Validations
 * @main Validations
 * @class Factory
 */

/**
 * Temporary fix until setOwner polyfill is created
 * https://github.com/rwjblue/ember-getowner-polyfill/issues/1
 */
function setOwner(obj, model) {
  obj = obj || {};
  if(Ember.setOwner) {
    Ember.setOwner(obj, getOwner(model));
  } else {
    obj.container = get(model, 'container');
  }
}

/**
 * Top level method that will ultimately return a mixin with all CP validations
 * @method  buildValidations
 * @param  {Object} validations  Validation rules
 * @return {Ember.Mixin}
 */
export default function buildValidations(validations = {}) {
  processDefaultOptions(validations);

  const Validations = createValidationsObject(validations);

  return Ember.Mixin.create({
    validations: computed(function() {
      return Validations.create({ model: this, _parentValidations: this._super() });
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
 * Validation rules can be created with default options
 * {
 *   description: 'Username',
 *   validators: [...]
 * }
 * This method generate the default options pojo, applies it to each validation rule, and flattens the object
 * @method processDefaultOptions
 * @private
 * @param  {Object} validations
 * @return
 */
function processDefaultOptions(validations = {}) {
  var validatableAttrs = Object.keys(validations);

  validatableAttrs.forEach(attribute => {
    let rules = validations[attribute];
    if(rules && typeof rules === 'object' && isArray(rules.validators)) {
      let options = Object.keys(rules).reduce((o, k) => {
        if(k !== 'validators') {
          o[k] = rules[k];
        }
        return o;
      }, {});
      let validators = rules.validators;
      validators.forEach(v => v.defaultOptions = options);
      validations[attribute] = validators;
    }
  });
}

/**
 * Creates the validations object that will become `model.validations`. Creates all necessary global CPs such as
 * `isValid`, `isAsync`, etc and also the `attrs` object.
 * @method createValidationsObject
 * @private
 * @param  {Object} validations
 * @return {Ember.Object}
 */
function createValidationsObject(validations = {}) {
  return Ember.Object.extend({
    model: null,
    attrs: null,
    isValidations: true,

    // Caches
    _validators: null,
    _debouncedValidations: null,

    // Private
    _validationRules: null,
    _validatableAttributes: null,
    _parentValidations: null,

    validate,
    validateSync,

    init() {
      this._super(...arguments);
      let validationRules = validations;
      let parentValidations = this.get('_parentValidations');
      let attrs = {};

      if(parentValidations) {
        validationRules = merge(merge({}, parentValidations.get('_validationRules')), validationRules);
      }

      let validatableAttributes = Object.keys(validationRules);
      validatableAttributes.forEach((attribute) => {
        attrs[attribute] = createCPValidationFor(attribute, validationRules[attribute]);
      });

      this.setProperties({
        _validatableAttributes: validatableAttributes,
        _validationRules: validationRules,
        _validators: {},
        _debouncedValidations: {},
        attrs: Ember.Object.extend(attrs).create({
          _model: this.get('model')
        })
      });

      createGlobalValidationProps(this);
    },

    destroy() {
      this._super(...arguments);
      let debouncedValidations = get(this, `_debouncedValidations`);

      // Cancel all debounced timers
      Object.keys(debouncedValidations).forEach(attr => {
        let attrCache = debouncedValidations[attr];
        // Itterate over each attribute and cancel all of its debounced validations
        Object.keys(attrCache).forEach(v => run.cancel(attrCache[v]));
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
function createCPValidationFor(attribute, validations) {
  var dependentKeys = getCPDependentKeysFor(attribute, validations);
  return computed(...dependentKeys, cycleBreaker(function() {
    var model = get(this, '_model');
    var validators = getValidatorsFor(attribute, model);

    var validationResults = validators.map(validator => {
      let options = validator.processOptions();
      let debounce = getWithDefault(options, 'debounce', 0);
      let disabled = getWithDefault(options, 'disabled', false);
      let value;

      if(disabled) {
        value = true;
      } else if(debounce > 0) {
        let cache = getDebouncedValidationsCacheFor(attribute, model);
        // Return a promise and pass the resolve method to the debounce handler
        value = new Promise(resolve => {
          cache[guidFor(validator)] = run.debounce(validator, debouncedValidate, validator, model, attribute, resolve, debounce, false);
        });
      } else {
        value = validator.validate(get(model, attribute), options, model, attribute);
      }

      return validationReturnValueHandler(attribute, value, model, validator);
    });

    return ValidationResultCollection.create({
      attribute, content: flatten(validationResults)
    });
  }));
}

/**
 * Create the global properties under the validations object.
 * These are computed collections on different properties of each attribute validations CP
 * @method createGlobalValidationProps
 * @private
 * @param  {Object} validations
 */
function createGlobalValidationProps(validations) {
  const validatableAttrs = validations.get('_validatableAttributes');
  validations.setProperties({
    isValid: and(...validatableAttrs.map((attr) => `attrs.${attr}.isValid`)).readOnly(),
    isValidating: or(...validatableAttrs.map((attr) => `attrs.${attr}.isValidating`)).readOnly(),
    isDirty: or(...validatableAttrs.map((attr) => `attrs.${attr}.isDirty`)).readOnly(),
    isAsync: or(...validatableAttrs.map((attr) => `attrs.${attr}.isAsync`)).readOnly(),
    isNotValidating: not('isValidating').readOnly(),
    isInvalid: not('isValid').readOnly(),
    isTruelyValid: and('isValid', 'isNotValidating').readOnly(),

    messages: computed(...validatableAttrs.map((attr) => `attrs.${attr}.messages`), function() {
      return emberArray(flatten(validatableAttrs.map(attr => get(this, `attrs.${attr}.messages`)))).compact();
    }),

    message: computed('messages.[]', cycleBreaker(function() {
      return get(this, 'messages.0');
    })),

    errors: computed(...validatableAttrs.map((attr) => `attrs.${attr}.@each.errors`), function() {
      return emberArray(flatten(validatableAttrs.map(attr => get(this, `attrs.${attr}.errors`)))).compact();
    }),

    error: computed('errors.[]', cycleBreaker(function() {
      return get(this, 'errors.0');
    })),

    _promise: computed(...validatableAttrs.map((attr) => `attrs.${attr}._promise`), function() {
      var promises = [];
      validatableAttrs.forEach((attr) => {
        var validation = get(this, `attrs.${attr}`);
        if (get(validation, 'isAsync')) {
          promises.push(get(validation, '_promise'));
        }
      });
      return RSVP.Promise.all(flatten(promises));
    })
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
function getCPDependentKeysFor(attribute, validations) {
  var dependentKeys = emberArray();
  validations = makeArray(validations);

  dependentKeys.push(`_model.${attribute}`);

  validations.forEach((validation) => {
    let type = validation._type;
    let options = validation.options;

    if (type === 'belongs-to') {
      dependentKeys.push(`${attribute}.isTruelyValid`);
    } else if (type === 'has-many') {
      dependentKeys.push(`${attribute}.@each.isTruelyValid`);
    } else if (type === 'ds-error') {
      dependentKeys.push(`_model.errors.${attribute}.[]`);
    } else if (type === 'confirmation' && validation.options.on) {
      dependentKeys.push(`_model.${validation.options.on}`);
    } else if (type === 'dependent') {
      var dependents = get(validation, 'options.on');
      if (!isEmpty(dependents)) {
        dependents.forEach((dependent) => dependentKeys.push(`${dependent}.isTruelyValid`));
      }
    } else if (type === 'collection' && (options === true || options.collection === true)) {
      dependentKeys.push(`_model.${attribute}.[]`);
    }

    let specifiedDependents = [].concat(getWithDefault(options, 'dependentKeys', []), getWithDefault(validation, 'defaultOptions.dependentKeys', []));
    specifiedDependents.forEach(d => {
      dependentKeys.push(`_model.${d}`);
    });
  });

  return dependentKeys.uniq();
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
  resolve(validator.validate(get(model, attribute), validator.processOptions(), model, attribute));
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
  var result, _promise;

  if (canInvoke(value, 'then')) {
    _promise = Promise.resolve(value);
    result = ValidationResult.create({
      attribute, _promise, model,
      _validator: validator
    });
  } else {
    result = ValidationResult.create({
      attribute, model,
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
  var validators = get(model, `validations._validators.${attribute}`);

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
  var debouncedValidations = get(model, `validations._debouncedValidations`);

  if (isNone(debouncedValidations[attribute])) {
    debouncedValidations[attribute] = {};
  }

  return debouncedValidations[attribute];
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
  var validations = get(model, 'validations');
  var validationRules = makeArray(get(validations, `_validationRules.${attribute}`));
  var validatorCache = get(validations, '_validators');
  var owner = getOwner(model);
  var validators = [];
  var validator;

  // We must have an owner to be able to lookup our validators
  if (isNone(owner)) {
    throw new TypeError(`[ember-cp-validations] ${model.toString()} is missing a container or owner.`);
  }

  validationRules.forEach((v) => {
    v.attribute = attribute;
    v.model = model;

    // If validate function exists, that means validator was created with a function so use the base class
    if (v._type === 'function') {
      validator = BaseValidator;
      setOwner(v, model);
    } else {
      validator = lookupValidator(owner, v._type);
    }
    validators.push(validator.create(v));
  });

  // Add validators to model instance cache
  validatorCache[attribute] = validators;

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
  var validatorClass = owner._lookupFactory(`validator:${type}`);
  if(isNone(validatorClass)) {
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
  var model = get(this, 'model');
  var whiteList = makeArray(options.on);
  var blackList = makeArray(options.excludes);
  var validationResult, value;

  var validationResults = get(this, '_validatableAttributes').reduce((v, name) => {
    if (!isEmpty(blackList) && blackList.indexOf(name) !== -1) {
      return v;
    }

    if (isEmpty(whiteList) || whiteList.indexOf(name) !== -1) {
      validationResult = get(this, `attrs.${name}`);

      // If an async validation is found, throw an error
      if (!async && get(validationResult, 'isAsync')) {
        throw new Error(`[ember-cp-validations] Synchronous validation failed due to ${name} being an async validation.`);
      }

      value = get(validationResult, 'value');
      v.push(validationResult);
    }
    return v;
  }, []);

  var validationResultsCollection = ValidationResultCollection.create({
    content: validationResults
  });

  var resultObject = {
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
