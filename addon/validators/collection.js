/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import Base from 'ember-cp-validations/validators/base';

const {
  isArray
} = Ember;

/**
 *  If `true` validates that the given value is a valid collection and will add `<ATTRIUTE>.[]` as a dependent key to the CP.
 *  If `false`, validates that the given value is singular. Use this validator if you want validation to occur when the content of your collection changes.
 *
 *  ```javascript
 *  // Examples
 *  validator('collection', true)
 *  validator('collection', false)
 *  validator('collection', {
 *    collection: true,
 *    message: 'must be a collection'
 *  })
 *  ```
 *
 *  @class Collection
 *  @module Validators
 *  @extends Base
 */
const Collection = Base.extend({

  /**
   * Normalized options passed in.
   * ```js
   * validator('collection', true)
   * // Becomes
   * validator('collection', {
   *   collection: true
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

    if (typeof options === 'boolean') {
      opts = {
        collection: options
      };
    }
    return this._super(opts, defaultOptions, globalOptions);
  },

  validate(value, options) {
    if (options.collection === true && !isArray(value)) {
      return this.createErrorMessage('collection', value, options);
    }

    if (options.collection === false && isArray(value)) {
      return this.createErrorMessage('singular', value, options);
    }

    return true;
  }
});

Collection.reopenClass({
  getDependentsFor(attribute, options) {
    return (options === true || options.collection === true) ? [ `_model.${attribute}.[]` ] : [];
  }
});

export default Collection;
