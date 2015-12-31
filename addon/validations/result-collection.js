/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import flatten from '../utils/flatten';
import cycleBreaker from '../utils/cycle-breaker';

const {
  get,
  set,
  RSVP,
  computed,
  isEmpty,
  A: emberArray
} = Ember;

const A = emberArray();

function callable(method) {
  return function(collection) {
    return A[method].apply(collection, arguments);
  };
}

const uniq = callable('uniq');
const compact = callable('compact');


/**
 * @module Validations
 * @class ResultCollection
 */
export default Ember.Object.extend({
  /**
   * A set of all validator {{#crossLink "Result"}}{{/crossLink}} objects for this specific attribute
   * @property content
   * @type {Ember.Array}
   */
  content: null,

  /**
   * The attribute that this collection belongs to
   * @property attribute
   * @type {String}
   */
  attribute: '',

  init() {
    this._super(...arguments);
    set(this, 'content', emberArray(get(this, 'content')));
  },

  /**
   * ```javascript
   * // Examples
   * get(user, 'validations.isInvalid')
   * get(user, 'validations.attrs.username.isInvalid')
   * ```
   *
   * @property isInvalid
   * @readOnly
   * @type {Ember.computed}
   */
  isInvalid: computed.not('isValid'),

  /**
   * ```javascript
   * // Examples
   * get(user, 'validations.isValid')
   * get(user, 'validations.attrs.username.isValid')
   * ```
   *
   * @property isValid
   * @default true
   * @readOnly
   * @type {Ember.computed}
   */
  isValid: computed('content.@each.isValid', cycleBreaker(function() {
    return get(this, 'content').isEvery('isValid', true);
  }, true)),

  /**
   * This property is toggled only if there is an async validation
   *
   * ```javascript
   * // Examples
   * get(user, 'validations.isValidating')
   * get(user, 'validations.attrs.username.isValidating')
   * ```
   *
   * @property isValidating
   * @default false
   * @readOnly
   * @type {Ember.computed}
   */
  isValidating: computed('content.@each.isValidating', cycleBreaker(function() {
    return !get(this, 'content').isEvery('isValidating', false);
  }, false)),

  /**
   * Will be true only if isValid is `true` and isValidating is `false`
   *
   * ```javascript
   * // Examples
   * get(user, 'validations.isTruelyValid')
   * get(user, 'validations.attrs.username.isTruelyValid')
   * ```
   *
   * @property isTruelyValid
   * @default true
   * @readOnly
   * @type {Ember.computed}
   */
  isTruelyValid: computed('content.@each.isTruelyValid', cycleBreaker(function() {
    return get(this, 'content').isEvery('isTruelyValid', true);
  }, true)),

  /**
   * Will be true is the attribute in question is not `null` or `undefined`. If the object being validated is an Ember Data Model and you have a `defaultValue` specified, then it will use that for comparison.
   *
   * ```javascript
   * // Examples
   * // 'username' : DS.attr('string', { defaultValue: 'johndoe' })
   * get(user, 'validations.isDirty')
   * get(user, 'validations.attrs.username.isDirty')
   * ```
   *
   * @property isDirty
   * @default false
   * @readOnly
   * @type {Ember.computed}
   */
  isDirty: computed('content.@each.isDirty', cycleBreaker(function() {
    return !get(this, 'content').isEvery('isDirty', false);
  }, false)),

  /**
   * Will be `true` only if a validation returns a promise
   *
   * ```javascript
   * // Examples
   * get(user, 'validations.isAsync')
   * get(user, 'validations.attrs.username.isAsync')
   * ```
   *
   * @property isAsync
   * @default false
   * @readOnly
   * @type {Ember.computed}
   */
  isAsync: computed('content.@each.isAsync', cycleBreaker(function() {
    return !get(this, 'content').isEvery('isAsync', false);
  }, false)),

  /**
   * A collection of all error messages on the object in question
   *
   * ```javascript
   * // Examples
   * get(user, 'validations.messages')
   * get(user, 'validations.attrs.username.messages')
   * ```
   *
   * @property messages
   * @readOnly
   * @type {Ember.computed}
   */
  messages: computed('content.@each.messages.[]', cycleBreaker(function() {
    let messages = flatten(get(this, 'content').getEach('messages'));
    return uniq(compact(messages));
  })),

  /**
   * An alias to the first message in the messages collection.
   *
   * ```javascript
   * // Example
   * get(user, 'validations.message')
   * get(user, 'validations.attrs.username.message')
   * ```
   *
   * @property message
   * @readOnly
   * @type {Ember.computed}
   */
  message: computed('messages.[]', cycleBreaker(function() {
    return get(this, 'messages.0');
  })),

  /**
   * A collection of all {{#crossLink "Error"}}Errors{{/crossLink}} on the object in question. Each error object includes the error message and it's associated attribute name.
   *
   * ```javascript
   * // Example
   * get(user, 'validations.errors')
   * get(user, 'validations.attrs.username.errors')
   * ```
   *
   * @property errors
   * @readOnly
   * @type {Ember.computed}
   */
  errors: computed('content.@each.errors.[]', cycleBreaker(function() {
    let errors = flatten(get(this, 'content').getEach('errors'));
    return uniq(compact(errors));
  })),

  /**
   * An alias to the first {{#crossLink "Error"}}{{/crossLink}} in the errors collection.
   *
   * ```javascript
   * // Example
   * get(user, 'validations.error')
   * get(user, 'validations.attrs.username.error')
   * ```
   *
   * @property error
   * @readOnly
   * @type {Ember.computed}
   */
  error: computed('errors.[]', cycleBreaker(function() {
    return get(this, 'errors.0');
  })),

  /**
   * @property _promise
   * @async
   * @private
   * @type {Ember.computed}
   */
  _promise: computed('content.@each._promise', cycleBreaker(function() {
    var promises = get(this, 'content').getEach('_promise');
    if (!isEmpty(promises)) {
      return RSVP.all(compact(flatten(promises)));
    }
  })),

  /**
   * @property value
   * @private
   * @type {Ember.computed}
   */
  value: computed('isAsync', cycleBreaker(function() {
    var isAsync = get(this, 'isAsync');
    var promise = get(this, '_promise');
    return isAsync ? promise : this;
  }))
});
