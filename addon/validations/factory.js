/**
 * Copyright 2015, Yahoo! Inc.
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
  set,
  RSVP,
  isNone,
  guidFor,
  isEmpty,
  isArray,
  computed,
  makeArray,
  canInvoke,
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
 * Top level method that will ultimately return a mixin with all CP validations
 * @param  {Object} validations  Validation rules
 * @return {Ember.Mixin}
 */
export default function buildValidations(validations = {}) {
  var validatableAttrs = Object.keys(validations);
  var props = createGlobalValidationProps(validatableAttrs);
  var attrs = {};

  // Private
  props._validators = {};
  props._validatableAttributes = validatableAttrs;
  props._validationRules = validations;

  processDefaultOptions(validations);

  validatableAttrs.forEach((attribute) => {
    attrs[attribute] = createCPValidationFor(attribute, validations[attribute]);
  });

  var AttrValidations = Ember.Object.extend(attrs);
  var GlobalValidations = Ember.Object.extend(props, {
    isValidations: true,
    validate,
    validateSync
  });

  return createMixin(GlobalValidations, AttrValidations);
}

/**
 * Validation rules can be created with default options
 * {
 *   description: 'Username',
 *   validators: [...]
 * }
 * This method generate the default options pojo, applies it to each validation rule, and flattens the object
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
 * Create the global properties under the validations object.
 * These are computed collections on different properties of each attribute validations CP
 * @param  {Array} validatableAttrs
 * @return {Object}
 */
function createGlobalValidationProps(validatableAttrs) {
  var props = {};
  props.isValid = and(...validatableAttrs.map((attr) => `attrs.${attr}.isValid`)).readOnly();
  props.isValidating = or(...validatableAttrs.map((attr) => `attrs.${attr}.isValidating`)).readOnly();
  props.isDirty = or(...validatableAttrs.map((attr) => `attrs.${attr}.isDirty`)).readOnly();
  props.isAsync = or(...validatableAttrs.map((attr) => `attrs.${attr}.isAsync`)).readOnly();
  props.isNotValidating = not('isValidating').readOnly();
  props.isInvalid = not('isValid').readOnly();
  props.isTruelyValid = and('isValid', 'isNotValidating').readOnly();

  props._promise = computed(...validatableAttrs.map((attr) => `attrs.${attr}._promise`), function() {
    var promises = [];
    validatableAttrs.forEach((attr) => {
      var validation = get(this, `attrs.${attr}`);
      if (get(validation, 'isAsync')) {
        promises.push(get(validation, '_promise'));
      }
    });
    return RSVP.all(flatten(promises));
  });

  props.messages = computed(...validatableAttrs.map((attr) => `attrs.${attr}.messages`), function() {
    var messages = [];
    validatableAttrs.forEach((attr) => {
      var validation = get(this, `attrs.${attr}`);
      if (validation) {
        messages.push(get(validation, 'messages'));
      }
    });

    return emberArray(flatten(messages)).compact();
  });

  props.message = computed('messages.[]', cycleBreaker(function() {
    return get(this, 'messages.0');
  }));


  props.errors = computed(...validatableAttrs.map((attr) => `attrs.${attr}.@each.errors`), function() {
    var errors = [];
    validatableAttrs.forEach((attr) => {
      var validation = get(this, `attrs.${attr}`);
      if (validation) {
        errors.push(get(validation, 'errors'));
      }
    });

    return emberArray(flatten(errors)).compact();
  });

  props.error = computed('errors.[]', cycleBreaker(function() {
    return get(this, 'errors.0');
  }));

  return props;
}

/**
 * Create the mixin that will be used to incorporate into the model
 * @param  {Object} validations
 * @return {Ember.Mixin}
 */
function createMixin(GlobalValidations, AttrValidations) {
  return Ember.Mixin.create({
    validate() {
        return get(this, 'validations').validate(...arguments);
      },
      validateSync() {
        return get(this, 'validations').validateSync(...arguments);
      },
      validations: computed(function() {
        return GlobalValidations.create({
          model: this,
          attrs: AttrValidations.create({
            _model: this
          })
        });
      }).readOnly()
  });
}

/**
 * CP generator for the given attribute
 * @param  {String} attribute
 * @param  {Array / Object} validations
 * @return {Computed Property} A computed property which is a ValidationResultCollection
 */
function createCPValidationFor(attribute, validations) {
  var dependentKeys = getCPDependentKeysFor(attribute, validations);
  return computed(...dependentKeys, cycleBreaker(function() {
    var model = get(this, '_model');
    // var modelErrors = get(model, 'errors');
    var validators = getValidatorsFor(attribute, model);

    var validationResults = validators.map((validator) => {
      var validationReturnValue = validator.validate(get(model, attribute), validator.processOptions(), model, attribute);
      return validationReturnValueHandler(attribute, validationReturnValue, model);
    });

    validationResults = flatten(validationResults);
    var validationResultsCollection = ValidationResultCollection.create({
      attribute, content: validationResults
    });

    // https://github.com/emberjs/data/issues/3707
    // if (hasEmberData() && model instanceof self.DS.Model && !isNone(modelErrors) && canInvoke(modelErrors, 'add')) {
    //   if(modelErrors.has(attribute)) {
    //     modelErrors.remove(attribute);
    //   }
    //   get(validationResultsCollection, 'messages').forEach((m) => modelErrors.add(attribute, m));
    // }

    return validationResultsCollection;
  }));
}

/**
 * CP dependency generator for a give attribute depending on its relationships
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

    if(isArray(options.dependentKeys)) {
      options.dependentKeys.forEach(k => {
        dependentKeys.push(`_model.${k}`);
      });
    }
  });

  return dependentKeys.uniq();
}

/**
 * A handler used to create ValidationResult object from values returned from a validator
 * @param  {String} attribute
 * @param  {Unknown} validationReturnValue
 * @param  {Object} model
 * @return {ValidationResult}
 */
function validationReturnValueHandler(attribute, validationReturnValue, model) {
  var result, _promise;

  if (canInvoke(validationReturnValue, 'then')) {
    _promise = Promise.resolve(validationReturnValue);
    result = ValidationResult.create({
      attribute, _promise, model
    });
  } else {
    result = ValidationResult.create({
      attribute, model
    });
    result.update(validationReturnValue);
  }

  return result;
}

/**
 * Unique id getter for validator cache
 * @param  {Object} model
 * @return {String} guid string of the given object
 */
function getKey(model) {
  return guidFor(model);
}

/**
 * Get validatiors for the give attribute. If they are not in the cache, then create them.
 * @param  {String} attribute
 * @param  {Object} model
 * @return {Array}
 */
function getValidatorsFor(attribute, model) {
  var key = getKey(model);
  var currentValidators = get(model, `validations._validators.${key}.${attribute}`);

  if (!Ember.isNone(currentValidators)) {
    return currentValidators;
  }

  return createValidatorsFor(attribute, model);
}

/**
 * Create validators for the give attribute and store them in a cache
 * @param  {String} attribute
 * @param  {Object} model
 * @return {Array}
 */
function createValidatorsFor(attribute, model) {
  var key = getKey(model);
  var validations = get(model, 'validations');
  var validationRules = makeArray(get(validations, `_validationRules.${attribute}`));
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
    if (canInvoke(v, 'validate')) {
      validator = BaseValidator;
    } else {
      validator = lookupValidator(owner, v._type);
    }
    if (!isNone(validator)) {
      validators.push(validator.create(v));
    }
  });

  // Check to see if there is already a cache started for this model instanse, if not create a new pojo
  if (isNone(get(validations, `_validators.${key}`))) {
    set(validations, `_validators.${key}`, {});
  }

  // Add validators to model instance cache
  set(validations, `_validators.${key}.${attribute}`, validators);

  return validators;
}

/**
 * Lookup a validators of a specific type on the owner
 * @param  {Ember.Owner} owner
 * @param  {String} type
 * @return {Class} Validator class or undefined if not found
 */
function lookupValidator(owner, type) {
  var validatorClass = owner._lookupFactory(`validator:${type}`);
  if (isNone(validatorClass)) {
    Ember.Logger.warn(`[ember-cp-validations] Validator not found of type: ${type}.`);
    return;
  }
  return validatorClass;
}

/**
 * Run manual validation on the model
 * @param  {Object}  options
 *         {
 *           on: {Array} Will only run validations on the attributes in this list
 *           excludes: {Array} Will skip validations on the attributes in this list
 *         }
 * @param  {Boolean} async      : If false, will get all validations and will error if an async validations is found.
 *                              : If true, will get all validations and wrap them in a promise hash
 * @return {[Promse, Object]}   : Promise if async is true, object if async is false
 */
function validate(options = {}, async = true) {
  var model = get(this, 'model');
  var whiteList = makeArray(options.on);
  var blackList = makeArray(options.excludes);
  var validationResult, value;

  var validationResults = get(this, '_validatableAttributes').reduce((v, name) => {
    validationResult = get(this, `attrs.${name}`);

    if (!isEmpty(blackList) && blackList.indexOf(name) > 0) {
      return v;
    }

    // If an async validation is found, throw an error
    if (!async && get(validationResult, 'isAsync')) {
      throw new Error(`[ember-cp-validations] Synchronous validation failed due to ${name} being an async validation.`);
    }

    if (isEmpty(whiteList) || whiteList.indexOf(name) > 0) {
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
 * Calls validate with async = false
 */
function validateSync(options) {
  return this.validate(options, false);
}
