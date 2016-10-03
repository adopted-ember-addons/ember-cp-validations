/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import Base from 'ember-cp-validations/validators/base';

const {
  get,
  assert,
  isPresent,
  getProperties
} = Ember;

/**
 *  Creates an alias between a single attribute's validations to another.
 *  This copies all messages, errors, etc., to the current attribute as well as
 *  its validation state (isValid, isValidating, etc.)
 *
 *   #### Options
 *  - `firstMessageOnly` (**Boolean**): If true, only returns the first error message of the
 *  aliased attribute and will not include validation state
 *
 *  ```javascript
 *  // Examples
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
const Alias = Base.extend({
  _type: 'alias',

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
        alias: options
      };
    }
    return this._super(opts, defaultOptions, globalOptions);
  },

  validate(value, options, model, attribute) {
    let { alias, firstMessageOnly } = getProperties(options, ['alias', 'firstMessageOnly']);

    assert(`[validator:alias] [${attribute}] option 'alias' is required`, isPresent(alias));

    let aliasValidation = get(model, `validations.attrs.${alias}`);

    return firstMessageOnly ? get(aliasValidation, 'message') : get(aliasValidation, 'content');
  }
});

Alias.reopenClass({
  getDependentsFor(attribute, options) {
    let alias = typeof options === 'string' ? options : get(options, 'alias');

    assert(`[validator:alias] [${attribute}] 'alias' must be a string`, typeof alias === 'string');

    return [ `${alias}.messages.[]`, `${alias}.isTruelyValid` ];
  }
});

export default Alias;
