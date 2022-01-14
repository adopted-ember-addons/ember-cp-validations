import { get } from '@ember/object';
import EmberValidator from 'ember-cp-validations/-private/ember-validator';

/**
 *  <i class="fa fa-hand-o-right" aria-hidden="true"></i> [See All Options](#method_validate)
 *
 *  If `true` validates that the given value is a valid collection and will add `<ATTRIBUTE>.[]` as a dependent key to the CP.
 *  If `false`, validates that the given value is singular. Use this validator if you want validation to occur when the content of your collection changes.
 *
 *  ## Examples
 *
 *  ```javascript
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
const Collection = EmberValidator.extend({
  _evType: 'collection',

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
        collection: options,
      };
    }
    return this._super(opts, defaultOptions, globalOptions);
  },
});

Collection.reopenClass({
  getDependentsFor(attribute, options) {
    return options === true || options.collection === true
      ? [`model.${attribute}.[]`]
      : [];
  },
});

export default Collection;
