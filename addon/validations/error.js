import Ember from 'ember';

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
   * The error message
   * @property message
   * @type {String}
   */
  message: null,

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
