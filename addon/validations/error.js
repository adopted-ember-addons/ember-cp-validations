import { tracked } from '@glimmer/tracking';

/**
 * @module Validations
 * @class Error
 */

export default class ValidationsError {
  /**
   * The error validator type
   * @property type
   * @type {String}
   */
  @tracked type;

  /**
   * The error message
   * @property message
   * @type {String}
   */
  @tracked message;

  /**
   * The attribute that the error belongs to
   * @property attribute
   * @type {String}
   */
  @tracked attribute;

  /**
   * The parent attribute that the error belongs to
   * @property parentAttribute
   * @type {String}
   */
  @tracked parentAttribute;

  static create(props) {
    return new ValidationsError(props);
  }

  constructor(props = {}) {
    Object.assign(this, props);
  }
}
