import Base from 'ember-cp-validations/validators/base';
import { assert } from '@ember/debug';

/**
 *  Accepts a custom `validate` function.
 *
 *  ## Examples
 *
 *  ```javascript
 *  validator('inline', {
 *    username: 'offirgolan',
 *    validate(value, options, model, attribute) {
 *      return value === options.username ?
 *             true :
 *             `Username must be ${options.username}`;
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
      options && typeof options.validate === 'function',
    );

    const opts = Object.assign({}, options);

    this.validate = opts.validate;
    delete opts.validate;

    return this._super(opts, ...args);
  },
});
