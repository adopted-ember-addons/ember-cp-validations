import { isNone } from '@ember/utils';
import { isArray } from '@ember/array';
import ResultCollection from '../validations/result-collection';
import WarningResultCollection from '../validations/warning-result-collection';
import InternalResultObject from './internal-result-object';
import { tracked, cached } from '@glimmer/tracking';
import { dependentKeyCompat } from '@ember/object/compat';

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
   * The validator that returned this result
   * @property _validator
   * @private
   * @type {Validator}
   */
  @tracked _validator;

  @tracked _resultOverride;

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
  @dependentKeyCompat
  get _isReadOnly() {
    let validations = this._result;
    return validations instanceof ResultCollection || validations.isValidations;
  }

  /**
   * @property isWarning
   * @readOnly
   * @type {Boolean}
   */
  @dependentKeyCompat
  get isWarning() {
    return this._validator.isWarning;
  }

  /**
   * @property isValid
   * @readOnly
   * @type {Boolean}
   */
  @dependentKeyCompat
  get isValid() {
    return this._result.isValid;
  }

  /**
   * @property isInvalid
   * @readOnly
   * @type {Boolean}
   */
  @dependentKeyCompat
  get isInvalid() {
    return this._result.isInvalid;
  }

  /**
   * @property message
   * @readOnly
   * @type {String}
   */
  @dependentKeyCompat
  get message() {
    return this._result.message;
  }

  /**
   * @property messages
   * @readOnly
   * @type {Array}
   */
  @dependentKeyCompat
  get messages() {
    return this._result.messages;
  }

  /**
   * @property error
   * @readOnly
   * @type {Object}
   */
  @dependentKeyCompat
  get error() {
    return this._result.error;
  }

  /**
   * @property errors
   * @readOnly
   * @type {Array}
   */
  @dependentKeyCompat
  get errors() {
    return this._result.errors;
  }

  /**
   * @property warningMessage
   * @readOnly
   * @type {String}
   */
  @dependentKeyCompat
  get warningMessage() {
    return this._result.warningMessage;
  }

  /**
   * @property warningMessages
   * @readOnly
   * @type {Array}
   */
  @dependentKeyCompat
  get warningMessages() {
    return this._result.warningMessages;
  }

  /**
   * @property warning
   * @readOnly
   * @type {Object}
   */
  @dependentKeyCompat
  get warning() {
    return this._result.warning;
  }

  /**
   * @property warnings
   * @readOnly
   * @type {Array}
   */
  @dependentKeyCompat
  get warnings() {
    return this._result.warnings;
  }

  @cached
  get _result() {
    return (
      this._resultOverride ??
      InternalResultObject.create({
        model: this.model,
        attribute: this.attribute,
        _validator: this._validator,
      })
    );
  }

  static create(props) {
    return new Result(props);
  }

  constructor(props = {}) {
    Object.assign(this, props);
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
    let attribute = this.attribute;
    let isWarning = this.isWarning;
    let Collection = isWarning ? WarningResultCollection : ResultCollection;

    if (isNone(value)) {
      return this.update(false);
    } else if (value.isValidations) {
      this._resultOverride = Collection.create({ attribute, content: [value] });
    } else if (isArray(value)) {
      this._resultOverride = Collection.create({ attribute, content: value });
    } else if (!this._isReadOnly) {
      if (typeof value === 'string') {
        Object.assign(this._result, {
          [isWarning ? 'warningMessage' : 'message']: value,
          isValid: isWarning ? true : false,
        });
      } else if (typeof value === 'boolean') {
        this._result.isValid = value;
      } else if (typeof value === 'object') {
        Object.assign(this._result, value);
      }
    }
  }
}
