/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import EmberValidator from 'ember-cp-validations/-private/ember-validator';

const {
  get,
  isNone
} = Ember;

/**
 *  <i class="fa fa-hand-o-right" aria-hidden="true"></i> [See All Options](#method_validate)
 *
 *  Validates the length of the attributes’ values.
 *
 *  ## Examples
 *
 *  ```javascript
 *  validator('length', {
 *    is: 15
 *  })
 *  validator('length', {
 *    min: 5,
 *    max: 10
 *  })
 *  ```
 *
 *  @class Length
 *  @module Validators
 *  @extends Base
 */
export default EmberValidator.extend({
  _evType: 'length',

  /**
   * Default allowNone to true
   *
   * @method buildOptions
   * @param  {Object}     options
   * @param  {Object}     defaultOptions
   * @param  {Object}     globalOptions
   * @return {Object}
   */
  buildOptions(options = {}, defaultOptions = {}, globalOptions = {}) {
    options.allowNone = isNone(get(options, 'allowNone')) ? true : get(options, 'allowNone');

    return this._super(options, defaultOptions, globalOptions);
  }
});
