import { isNone } from '@ember/utils';

import { isArray } from '@ember/array';
import EmberObject, {
  getProperties,
  setProperties,
  computed,
  set,
  get
} from '@ember/object';
import ResultCollection from '../validations/result-collection';
import WarningResultCollection from '../validations/warning-result-collection';
import InternalResultObject from './internal-result-object';

const { readOnly } = computed;

/**
 * __PRIVATE__
 *
 * @module Validations
 * @class Result
 * @private
 */

const Result = EmberObject.extend({
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
   * Determines if the _result object is readOnly.
   *
   * This is needed because ResultCollections and global validation objects control their own
   * state via CPs
   *
   * @property _isReadOnly
   * @private
   * @readOnly
   * @type {Boolean}
   */
  _isReadOnly: computed('_result', function() {
    let validations = get(this, '_result');
    return (
      validations instanceof ResultCollection ||
      get(validations, 'isValidations')
    );
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
  isValid: readOnly('_result.isValid'),

  /**
   * @property isInvalid
   * @readOnly
   * @type {Boolean}
   */
  isInvalid: readOnly('_result.isInvalid'),

  /**
   * @property isValidating
   * @readOnly
   * @type {Boolean}
   */
  isValidating: readOnly('_result.isValidating'),

  /**
   * @property isTruelyValid
   * @readOnly
   * @type {Boolean}
   */
  isTruelyValid: readOnly('_result.isTruelyValid'),

  /**
   * @property isTruelyInvalid
   * @readOnly
   * @type {Boolean}
   */
  isTruelyInvalid: readOnly('_result.isTruelyInvalid'),

  /**
   * @property isAsync
   * @readOnly
   * @type {Boolean}
   */
  isAsync: readOnly('_result.isAsync'),

  /**
   * @property message
   * @readOnly
   * @type {String}
   */
  message: readOnly('_result.message'),

  /**
   * @property messages
   * @readOnly
   * @type {Array}
   */
  messages: readOnly('_result.messages'),

  /**
   * @property error
   * @readOnly
   * @type {Object}
   */
  error: readOnly('_result.error'),

  /**
   * @property errors
   * @readOnly
   * @type {Array}
   */
  errors: readOnly('_result.errors'),

  /**
   * @property warningMessage
   * @readOnly
   * @type {String}
   */
  warningMessage: readOnly('_result.warningMessage'),

  /**
   * @property warningMessages
   * @readOnly
   * @type {Array}
   */
  warningMessages: readOnly('_result.warningMessages'),

  /**
   * @property warning
   * @readOnly
   * @type {Object}
   */
  warning: readOnly('_result.warning'),

  /**
   * @property warnings
   * @readOnly
   * @type {Array}
   */
  warnings: readOnly('_result.warnings'),

  /**
   * This hold all the logic for the above CPs. We do this so we can easily switch this object out with a different validations object
   * @property _result
   * @private
   * @type {Result}
   */
  _result: computed(
    'model',
    'attribute',
    '_promise',
    '_validator',
    '_resultOverride',
    function() {
      return (
        get(this, '_resultOverride') ||
        InternalResultObject.create(
          getProperties(this, ['model', 'attribute', '_promise', '_validator'])
        )
      );
    }
  ),

  init() {
    this._super(...arguments);

    if (get(this, 'isAsync') && !get(this, '_isReadOnly')) {
      this._handlePromise();
    }
  },

  /**
   * Update the current validation result object with the given value
   * - If value is undefined or null, set isValid to false
   * - If value is a validations object from a different model/object, set the _result object to the one given (belongs-to)
   * - If value is a collection of result objects, create a Validation Result Collection and set that to the _result object (has-many)
   * - If value is a string, set the message to the given string and set isValid to false
   * - If value is a boolean, set isValid to result
   * - If value is a pojo, update _result object with the information given
   *
   * @method update
   * @private
   * @param value
   */
  update(value) {
    let result = get(this, '_result');
    let attribute = get(this, 'attribute');
    let isWarning = get(this, 'isWarning');
    let Collection = isWarning ? WarningResultCollection : ResultCollection;

    if (isNone(value)) {
      return this.update(false);
    } else if (get(value, 'isValidations')) {
      this._overrideResult(Collection.create({ attribute, content: [value] }));
    } else if (isArray(value)) {
      this._overrideResult(Collection.create({ attribute, content: value }));
    } else if (!get(this, '_isReadOnly')) {
      this._overrideResult(undefined);

      if (typeof value === 'string') {
        setProperties(get(this, '_result'), {
          [isWarning ? 'warningMessage' : 'message']: value,
          isValid: isWarning ? true : false
        });
      } else if (typeof value === 'boolean') {
        set(result, 'isValid', value);
      } else if (typeof value === 'object') {
        setProperties(result, value);
      }
    }
  },

  /**
   * Override the internal _result property.
   * @method _overrideResult
   * @param result
   * @private
   */
  _overrideResult(result) {
    set(this, '_resultOverride', result);
  },

  /**
   * Promise handler
   * @method _handlePromise
   * @private
   */
  _handlePromise() {
    get(this, '_promise')
      .then(value => this.update(value), value => this.update(value))
      .catch(reason => {
        // TODO: send into error state
        throw reason;
      });
  }
});

export default Result;
