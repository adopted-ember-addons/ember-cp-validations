/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import ResultCollection from '../validations/result-collection';
import InternalResultObject from './internal-result-object';

const {
  get,
  set,
  isNone,
  isArray,
  computed,
  setProperties,
  getProperties
} = Ember;

const {
  readOnly
} = computed;

/**
 * __PRIVATE__
 *
 * @module Validations
 * @class Result
 * @private
 */

const Result = Ember.Object.extend({

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
   * Determines if the _validations object is readOnly.
   *
   * This is needed because ResultCollections and global validation objects control their own
   * state via CPs
   *
   * @property _isReadOnly
   * @private
   * @readOnly
   * @type {Boolean}
   */
  _isReadOnly: computed('_validations', function() {
    let validations = get(this, '_validations');
    return (validations instanceof ResultCollection) || get(validations, 'isValidations');
  }).readOnly(),

  /**
   * @property isWarning
   * @readOnly
   * @type {Boolean}
   */
  isWarning: readOnly('_validator.isWarning'),

  /**
   * @property isValid
   * @readOnly
   * @type {Boolean}
   */
  isValid: readOnly('_validations.isValid'),

  /**
   * @property isInvalid
   * @readOnly
   * @type {Boolean}
   */
  isInvalid: readOnly('_validations.isInvalid'),

  /**
   * @property isValidating
   * @readOnly
   * @type {Boolean}
   */
  isValidating: readOnly('_validations.isValidating'),

  /**
   * @property isTruelyValid
   * @readOnly
   * @type {Boolean}
   */
  isTruelyValid: readOnly('_validations.isTruelyValid'),

  /**
   * @property isAsync
   * @readOnly
   * @type {Boolean}
   */
  isAsync: readOnly('_validations.isAsync'),

  /**
   * @property isDirty
   * @readOnly
   * @type {Boolean}
   */
  isDirty: readOnly('_validations.isDirty'),

  /**
   * @property message
   * @readOnly
   * @type {String}
   */
  message: readOnly('_validations.message'),

  /**
   * @property messages
   * @readOnly
   * @type {Array}
   */
  messages: readOnly('_validations.messages'),

  /**
   * @property error
   * @readOnly
   * @type {Object}
   */
  error: readOnly('_validations.error'),

  /**
   * @property errors
   * @readOnly
   * @type {Array}
   */
  errors: readOnly('_validations.errors'),

  /**
   * This hold all the logic for the above CPs. We do this so we can easily switch this object out with a different validations object
   * @property _validations
   * @private
   * @type {Result}
   */
  _validations: computed('model', 'attribute', '_promise', '_validator', function() {
    return InternalResultObject.create(getProperties(this, ['model', 'attribute', '_promise', '_validator']));
  }),

  init() {
    this._super(...arguments);

    if (get(this, 'isAsync') && !get(this, '_isReadOnly')) {
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
    let validations = get(this, '_validations');
    let validator = get(this, '_validator');
    let { model, attribute } = getProperties(this, ['model', 'attribute']);

    if (isNone(result)) {
      this.update(false);
      return;
    }

    if (get(result, 'isValidations')) {
      set(this, '_validations', result);
    } else if (isArray(result)) {
      let validationResultsCollection = ResultCollection.create({
        attribute,
        content: result.map((r) => Result.create({
          attribute,
          model,
          _validator: validator,
          _validations: r
        }))
      });
      set(this, '_validations', validationResultsCollection);
    } else if (!get(this, '_isReadOnly')) {
      if (typeof result === 'string') {
        setProperties(validations, {
          message: result,
          isValid: false
        });
      } else if (typeof result === 'boolean') {
        set(validations, 'isValid', result);
      } else if (typeof result === 'object') {
        setProperties(validations, result);
      }
    }
  },

  /**
   * Promise handler
   * @method _handlePromise
   * @private
   */
  _handlePromise() {
    get(this, '_promise').then(
      (result) => this.update(result),
      (result) => this.update(result)
    ).catch((reason) => {
      // TODO: send into error state
      throw reason;
    });
  }
});

export default Result;
