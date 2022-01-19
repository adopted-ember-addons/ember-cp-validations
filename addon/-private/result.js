import { isNone } from '@ember/utils';
import { isArray } from '@ember/array';
import ResultCollection from '../validations/result-collection';
import WarningResultCollection from '../validations/warning-result-collection';
import InternalResultObject from './internal-result-object';
import { tracked } from '@glimmer/tracking';

/**
 * __PRIVATE__
 *
 * @module Validations
 * @class Result
 * @private
 */

export default class Result {
  /**
   * @property model
   * @type {Object}
   */
  @tracked model;

  /**
   * @property attribute
   * @type {String}
   */
  @tracked attribute;

  /**
   * @property _promise
   * @async
   * @private
   * @type {Promise}
   */
  @tracked _promise;

  /**
   * The validator that returned this result
   * @property _validator
   * @private
   * @type {Validator}
   */
  @tracked _validator;

  @tracked _result;

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
  get _isReadOnly() {
    let validations = this._result;
    return validations instanceof ResultCollection || validations.isValidations;
  }

  /**
   * @property isWarning
   * @readOnly
   * @type {Boolean}
   */
  get isWarning() {
    return this._validator.isWarning;
  }

  /**
   * @property isValid
   * @readOnly
   * @type {Boolean}
   */
  get isValid() {
    return this._result.isValid;
  }

  /**
   * @property isInvalid
   * @readOnly
   * @type {Boolean}
   */
  get isInvalid() {
    return this._result.isInvalid;
  }

  /**
   * @property isValidating
   * @readOnly
   * @type {Boolean}
   */
  get isValidating() {
    return this._result.isValidating;
  }

  /**
   * @property isTruelyValid
   * @readOnly
   * @type {Boolean}
   */
  get isTruelyValid() {
    return this._result.isTruelyValid;
  }

  /**
   * @property isTruelyInvalid
   * @readOnly
   * @type {Boolean}
   */
  get isTruelyInvalid() {
    return this._result.isTruelyInvalid;
  }

  /**
   * @property isAsync
   * @readOnly
   * @type {Boolean}
   */
  get isAsync() {
    return this._result.isAsync;
  }

  /**
   * @property message
   * @readOnly
   * @type {String}
   */
  get message() {
    return this._result.message;
  }

  /**
   * @property messages
   * @readOnly
   * @type {Array}
   */
  get messages() {
    return this._result.messages;
  }

  /**
   * @property error
   * @readOnly
   * @type {Object}
   */
  get error() {
    return this._result.error;
  }

  /**
   * @property errors
   * @readOnly
   * @type {Array}
   */
  get errors() {
    return this._result.errors;
  }

  /**
   * @property warningMessage
   * @readOnly
   * @type {String}
   */
  get warningMessage() {
    return this._result.warningMessage;
  }

  /**
   * @property warningMessages
   * @readOnly
   * @type {Array}
   */
  get warningMessages() {
    return this._result.warningMessages;
  }

  /**
   * @property warning
   * @readOnly
   * @type {Object}
   */
  get warning() {
    return this._result.warning;
  }

  /**
   * @property warnings
   * @readOnly
   * @type {Array}
   */
  get warnings() {
    return this._result.warnings;
  }

  static create(props) {
    return new Result(props);
  }

  constructor(props = {}) {
    Object.assign(this, props);

    this._result = InternalResultObject.create({
      model: this.model,
      attribute: this.attribute,
      _promise: this._promise,
      _validator: this._validator,
    });

    if (this.isAsync && !this._isReadOnly) {
      this._handlePromise();
    }
  }

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
    let result = this._result;
    let attribute = this.attribute;
    let isWarning = this.isWarning;
    let Collection = isWarning ? WarningResultCollection : ResultCollection;

    if (isNone(value)) {
      return this.update(false);
    } else if (value.isValidations) {
      this._overrideResult(Collection.create({ attribute, content: [value] }));
    } else if (isArray(value)) {
      this._overrideResult(Collection.create({ attribute, content: value }));
    } else if (!this._isReadOnly) {
      if (typeof value === 'string') {
        Object.assign(this._result, {
          [isWarning ? 'warningMessage' : 'message']: value,
          isValid: isWarning ? true : false,
        });
      } else if (typeof value === 'boolean') {
        result.isValid = value;
      } else if (typeof value === 'object') {
        Object.assign(result, value);
      }
    }
  }

  /**
   * Override the internal _result property.
   * @method _overrideResult
   * @param result
   * @private
   */
  _overrideResult(result) {
    this._result = result;
  }

  /**
   * Promise handler
   * @method _handlePromise
   * @private
   */
  _handlePromise() {
    this._promise
      .then(
        (value) => this.update(value),
        (value) => this.update(value)
      )
      .catch((reason) => {
        // TODO: send into error state
        throw reason;
      });
  }
}
