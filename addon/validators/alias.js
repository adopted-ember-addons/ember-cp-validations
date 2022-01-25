import { assert } from '@ember/debug';
import { isPresent } from '@ember/utils';
import Base from 'ember-cp-validations/validators/base';

/**
 *  <i class="fa fa-hand-o-right" aria-hidden="true"></i> [See All Options](#method_validate)
 *
 *  Creates an alias between a single attribute's validations to another.
 *  This copies all messages, errors, etc., to the current attribute as well as
 *  its validation state (isValid etc.)
 *
 *  ## Examples
 *
 *  ```javascript
 *  validator('alias', 'attribute')
 *  validator('alias', {
 *    alias: 'attribute',
 *    firstMessageOnly: true
 *  })
 *  ```
 *
 *  @class Alias
 *  @module Validators
 *  @extends Base
 */
export default class ValidatorsAlias extends Base {
  /**
   * Normalized options passed in.
   * ```js
   * validator('alias', 'attribute')
   * // Becomes
   * validator('alias', {
   *   alias: 'attribute'
   * })
   * ```
   *
   * @method buildOptions
   * @param  {Object}     options
   * @param  {Object}     defaultOptions
   * @param  {Object}     globalOptions
   * @return {Object}
   */
  buildOptions(options = {}, defaultOptions = {}, globalOptions = {}) {
    let opts = options;

    if (typeof options === 'string') {
      opts = {
        alias: options,
      };
    }
    return super.buildOptions(opts, defaultOptions, globalOptions);
  }

  /**
   * @method validate
   * @param {Any} value
   * @param {Object} options
   * @param {String} options.alias The attribute to alias
   * @param {Boolean} options.firstMessageOnly If true, only returns the first error message of the
   *                                           aliased attribute and will not include validation state
   * @param {Object} model
   * @param {String} attribute
   */
  validate(value, options, model, attribute) {
    const { alias, firstMessageOnly } = options;

    assert(
      `[validator:alias] [${attribute}] option 'alias' is required`,
      isPresent(alias)
    );

    let aliasValidation = model.validations.attrs[alias];

    return firstMessageOnly ? aliasValidation.message : aliasValidation.content;
  }

  static create(props) {
    return new ValidatorsAlias(props);
  }
}
