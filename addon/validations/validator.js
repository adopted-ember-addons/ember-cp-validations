/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
import Ember from 'ember';

const {
  isNone
} = Ember;

/**
 * ```javascript
 *   validator(type, options)
 * ```
 * @module Validators
 * @main Validators
 */
export default function(arg1, options) {
  options = isNone(options) ? {} : options;

  var props = {
    options
  };

  if (typeof arg1 === 'function') {
    props.validate = arg1;
    props._type = 'function';
  } else if (typeof arg1 === 'string') {
    props._type = arg1;
  } else {
    throw new TypeError('[ember-cp-validations] Unexpected type for first validator argument. It should either be a string or a function');
  }

  return props;
}
