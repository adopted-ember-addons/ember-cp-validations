/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import ValidationResultCollection from './result-collection';
import InternalResultObject from './internal-result-object';

const {
  get,
  set,
  isNone,
  isArray,
  computed,
  setProperties,
  getProperties,
} = Ember;

const {
  readOnly
} = computed;

/**
 * This class is `private` and is only used by {{#crossLink 'ResultCollection'}}{{/crossLink}}
 * @module Validations
 * @class Result
 * @private
 */

export default Ember.Object.extend({

  /**
   * @property model
   * @type {Object}
   */
  model: null,

  /**
   * @property attribute
   * @type {String}
   */
  attribute: '',

  /**
   * @property _promise
   * @async
   * @private
   * @type {Promise}
   */
  _promise: null,

  /**
   * The validator that returned this result
   * @property _validator
   * @private
   * @type {Validator}
   */
  _validator: null,

  /**
   * @property isValid
   * @readOnly
   * @type {Ember.ComputedProperty}
   */
  isValid: readOnly('_validations.isValid'),

  /**
   * @property isInvalid
   * @readOnly
   * @type {Ember.ComputedProperty}
   */
  isInvalid: readOnly('_validations.isInvalid'),

  /**
   * @property isValidating
   * @readOnly
   * @type {Ember.ComputedProperty}
   */
  isValidating: readOnly('_validations.isValidating'),

  /**
   * @property isTruelyValid
   * @readOnly
   * @type {Ember.ComputedProperty}
   */
  isTruelyValid: readOnly('_validations.isTruelyValid'),

  /**
   * @property isAsync
   * @readOnly
   * @type {Ember.ComputedProperty}
   */
  isAsync: readOnly('_validations.isAsync'),

  /**
   * @property isDirty
   * @readOnly
   * @type {Ember.ComputedProperty}
   */
  isDirty: readOnly('_validations.isDirty'),

  /**
   * @property message
   * @readOnly
   * @type {Ember.ComputedProperty}
   */
  message: readOnly('_validations.message'),

  /**
   * @property messages
   * @readOnly
   * @type {Ember.ComputedProperty}
   */
  messages: readOnly('_validations.messages'),

  /**
   * @property error
   * @readOnly
   * @type {Ember.ComputedProperty}
   */
  error: readOnly('_validations.error'),

  /**
   * @property errors
   * @readOnly
   * @type {Ember.ComputedProperty}
   */
  errors: readOnly('_validations.errors'),

  /**
   * This hold all the logic for the above CPs. We do this so we can easily switch this object out with a different validations object
   * @property _validations
   * @private
   * @type {Result}
   */
  _validations: computed('model', 'attribute', '_promise', function () {
    return InternalResultObject.create(getProperties(this, ['model', 'attribute', '_promise']));
  }),

  init() {
    this._super(...arguments);

    if (get(this, 'isAsync')) {
      this._handlePromise();
    }
  },

  /**
   * Update the current validation result object with the given result
   * - If result is undefined or null, set isValid to false
   * - If result is a validations object from a different model/object, set the _validations object to the one given (belongs-to)
   * - If result is a collection of result objects, create a Validation Result Collection and set that to the _validations object (has-many)
   * - If result is a string, set the message to the given string and set isValid to false
   * - If result is a boolean, set isValid to result
   * - If result is a pojo, update _validations object with the information given
   *
   * @method update
   * @private
   * @param result
   */
  update(result) {
    const validations = get(this, '_validations');

    if (isNone(result)) {
      this.update(false);
      return;
    }

    if (get(result, 'isValidations')) {
      set(this, '_validations', result);
    } else if (isArray(result)) {
      const validationResultsCollection = ValidationResultCollection.create({
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

  /**
   * Promise handler
   * @method  _handlePromise
   * @private
   */
  _handlePromise() {
    const validations = get(this, '_validations');

    set(validations, 'isValidating', true);
    get(this, '_promise').then(
      result => this.update(result),
      result => this.update(result)
    ).catch(reason => {
      // TODO: send into error state
      throw reason;
    }).finally(() => {
      set(validations, 'isValidating', false);
    });
  }
});
