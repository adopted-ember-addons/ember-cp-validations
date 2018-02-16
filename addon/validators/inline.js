import Base from 'ember-cp-validations/validators/base';
import { assign } from '@ember/polyfills';
import { assert } from '@ember/debug';

/**
 *  <i class="fa fa-hand-o-right" aria-hidden="true"></i> [See All Options](#method_validate)
 *
 *  If `true` validates that the given value is not empty, if `false`, validates that the given value is empty.
 *
 *  ## Examples
 *
 *  ```javascript
 *  validator('inline', {
 *    validate(value, options, model, attribute) {
 *      return value === options.username ?
 *             true :
 *             `{description} must be ${options.username}`;
 *    }
 *  });
 *  ```
 *
 *  @class Inline
 *  @module Validators
 *  @extends Base
 */
export default Base.extend({
  /**
   * Override the validator's `validate` method with the one that was
   * passed in via the options.
   *
   * @method buildOptions
   * @param  {Object}     options
   * @param  {Object}     defaultOptions
   * @param  {Object}     globalOptions
   * @return {Object}
   */
  buildOptions(options = {}, ...args) {
    assert(
      `[validator:inline] You must pass in a validate function`,
      options && typeof options.validate === 'function'
    );

    const opts = assign({}, options);

    this.validate = opts.validate;
    delete opts.validate;

    return this._super(opts, ...args);
  }
});
