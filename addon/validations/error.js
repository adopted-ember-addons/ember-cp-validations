import Ember from 'ember';

/**
 * @module Validations
 * @class Error
 */

export default Ember.Object.extend({

  /**
   * The attribute that the error belongs to
   * @property attribute
   * @type {String}
   */
  attribute: null,

  /**
   * The error message
   * @property message
   * @type {String}
   */
  message: null
});
