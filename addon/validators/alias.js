/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import Base from 'ember-cp-validations/validators/base';

const {
  get,
  isEmpty
} = Ember;

/**
 *  Creates an alias between a single attribute's validations to another. 
 *
 *  ```javascript
 *  // Examples
 *  validator('alias', 'attribute')
 *  validator('alias', {
 *    alias: 'attribute'
 *  })
 *  ```
 *
 *  @class Alias
 *  @module Validators
 *  @extends Base
 */
export default Base.extend({

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

  validate(value, options, model) {
    const alias = options.alias;

    if(!isEmpty(alias)) {
      return get(model, `validations.attrs.${alias}.content`);
    }

    return true;
  }
});
