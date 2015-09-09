/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import ValidationResultCollection from './validation-result-collection';
import { hasEmberData } from './utils';

const {
  get,
  set,
  isNone,
  isArray,
  computed,
  canInvoke,
  setProperties,
  getProperties,
  defineProperty,
  A: emberArray
} = Ember;

const {
  and,
  not
} = computed;


var ValidationsObject = Ember.Object.extend({
  model: null,
  isValid: true,
  isValidating: false,
  message: null,
  attribute: '',

  attrValue: undefined,
  _promise: undefined,

  init() {
    this._super(...arguments);
    var attribute = get(this, 'attribute');
    // TODO: Not good practice. Stef will make this go away.
    defineProperty(this, 'attrValue', computed.oneWay(`model.${attribute}`));
  },

  isNotValidating: not('isValidating'),
  isInvalid: not('isValid'),
  isTruelyValid: and('isNotValidating', 'isValid'),

  isAsync: computed('_promise', function() {
    var promise = get(this, '_promise');
    return !isNone(promise) && canInvoke(promise, 'then');
  }),

  isDirty: computed('attrValue', function() {
    var model = get(this, 'model');
    var attribute = get(this, 'attribute');
    var attrValue = get(this, 'attrValue');

    // Check default model values
    if (hasEmberData() && model instanceof self.DS.Model && canInvoke(model, 'eachAttribute')) {
      let attrMeta = model.get('constructor.attributes').get(attribute);
      if (attrMeta) {
        let defaultValue = attrMeta.options.defaultValue;
        if (defaultValue) {
          return defaultValue !== attrValue;
        }
      }
    }
    return !isNone(attrValue);
  })
});

export default Ember.Object.extend({
  model: null,
  attribute: '',
  _promise: undefined,

  isValid: computed.oneWay('_validations.isValid'),
  isInvalid: computed.oneWay('_validations.isInvalid'),
  isValidating: computed.oneWay('_validations.isValidating'),
  isTruelyValid: computed.oneWay('_validations.isTruelyValid'),
  isAsync: computed.oneWay('_validations.isAsync'),
  isDirty: computed.oneWay('_validations.isDirty'),
  message: computed.oneWay('_validations.message'),

  // This hold all the logic for the above CPs. We do this so we can easily switch this object out with a different validations object
  _validations: computed('model', 'attribute', '_promise', function() {
    return ValidationsObject.create(getProperties(this, ['model', 'attribute', '_promise']));
  }),

  init() {
    this._super(...arguments);

    if (get(this, 'isAsync')) {
      this._handlePromise();
    }
  },

  /**
   * Update the current validation result object with the given result
   * If result is undefined or null, set isValid to false
   * If result is a validations object from a different model/object, set the _validations object to the one given (belongs-to)
   * If result is a collection of validation result objects, create a Validation Result Collection and set that to the _validations object (has-many)
   * If result is a string, set the message to the given string and set isValid to false
   * If result is a boolean, set isValid to result
   * If result is a pojo, update _validations object with the information given
   */
  update(result) {
    var validations = get(this, '_validations');

    if (isNone(result)) {
      this.update(false);
    }

    if (get(result, 'isValidations')) {
      set(this, '_validations', result);
    } else if (isArray(result) && emberArray(result).isEvery('isValidations', true)) {
      var validationResultsCollection = ValidationResultCollection.create({
        attribute: get(this, 'attribute'),
        content: result
      });
      set(this, '_validations', validationResultsCollection);
    } else if (typeof result === 'string') {
      setProperties(validations, {
        message: result,
        isValid: false
      });
    } else if (typeof result === 'boolean') {
      set(validations, 'isValid', result);
    } else if (typeof result === 'object') {
      setProperties(validations, result);
    }
  },

  _handlePromise() {
    var validations = get(this, '_validations');
    set(validations, 'isValidating', true);
    get(this, '_promise').then(
      (result) => this.update(result), (result) => this.update(result)).catch(reason => {
      // TODO: send into error state
      throw reason;
    }).finally(() => {
      set(validations, 'isValidating', false);
    });
  }
});
