import Ember from 'ember';

const {
  computed
} = Ember;

/**
 * @module Validations
 * @class Error
 */

export default Ember.Object.extend({
  /**
   * The error validator type
   * @property type
   * @type {String}
   */
  type: null,

  /**
   * The error returned by the validators `validate` method
   * @property message
   * @type {Any}
   */
  result: null,

  /**
   * The error message
   * @property message
   * @type {String}
   */
  message: computed.readOnly('result'),

  /**
   * The attribute that the error belongs to
   * @property attribute
   * @type {String}
   */
  attribute: null,

  /**
   * The parent attribute that the error belongs to
   * @property parentAttribute
   * @type {String}
   */
  parentAttribute: null
});
