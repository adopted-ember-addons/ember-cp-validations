/**
 * Copyright 2016, Yahoo! Inc.
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
  isArray,
  isNone,
  A: emberArray
} = Ember;

const assign = Ember.assign || Ember.merge;
const A = emberArray();

function callable(method) {
  return function (collection) {
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
   * @type {Ember.ComputedProperty | Boolean}
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
   * @type {Ember.ComputedProperty | Boolean}
   */
  isValid: computed('_errorContent.@each.isValid', cycleBreaker(function () {
    return get(this, '_errorContent').isEvery('isValid', true);
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
   * @type {Ember.ComputedProperty | Boolean}
   */
  isValidating: computed('_errorContent.@each.isValidating', cycleBreaker(function () {
    return !get(this, '_errorContent').isEvery('isValidating', false);
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
   * @type {Ember.ComputedProperty | Boolean}
   */
  isTruelyValid: computed('_errorContent.@each.isTruelyValid', cycleBreaker(function () {
    return get(this, '_errorContent').isEvery('isTruelyValid', true);
  }, true)),

  /**
   * Will be true is the attribute in question is not `null` or `undefined`. If the object being
   * validated is an Ember Data Model and you have a `defaultValue` specified, then it will use that for comparison.
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
   * @type {Ember.ComputedProperty | Boolean}
   */
  isDirty: computed('_errorContent.@each.isDirty', cycleBreaker(function () {
    return !get(this, '_errorContent').isEvery('isDirty', false);
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
   * @type {Ember.ComputedProperty | Boolean}
   */
  isAsync: computed('_errorContent.@each.isAsync', cycleBreaker(function () {
    return !get(this, '_errorContent').isEvery('isAsync', false);
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
   * @type {Ember.ComputedProperty | Array}
   */
  messages: computed('_errorContent.@each.messages', cycleBreaker(function () {
    const messages = flatten(get(this, '_errorContent').getEach('messages'));

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
   * @type {Ember.ComputedProperty | String}
   */
  message: computed('messages.[]', cycleBreaker(function () {
    return get(this, 'messages.0');
  })),

  /**
   * A collection of all {{#crossLink "Error"}}Warnings{{/crossLink}} on the object in question.
   * Each warning object includes the warning message and it's associated attribute name.
   *
   * ```javascript
   * // Example
   * get(user, 'validations.warnings')
   * get(user, 'validations.attrs.username.warnings')
   * ```
   *
   * @property warnings
   * @readOnly
   * @type {Ember.ComputedProperty | Array}
   */
  warnings: computed('attribute', '_warningContent.@each.errors', cycleBreaker(function () {
    return this._computeErrorCollection(get(this, '_warningContent'));
  })),

  /**
   * An alias to the first {{#crossLink "Warning"}}{{/crossLink}} in the warnings collection.
   *
   * ```javascript
   * // Example
   * get(user, 'validations.warning')
   * get(user, 'validations.attrs.username.warning')
   * ```
   *
   * @property warning
   * @readOnly
   * @type {Ember.ComputedProperty | Error}
   */
  warning: computed('warnings.[]', cycleBreaker(function () {
    return get(this, 'warnings.0');
  })),

  /**
   * A collection of all {{#crossLink "Error"}}Errors{{/crossLink}} on the object in question.
   * Each error object includes the error message and it's associated attribute name.
   *
   * ```javascript
   * // Example
   * get(user, 'validations.errors')
   * get(user, 'validations.attrs.username.errors')
   * ```
   *
   * @property errors
   * @readOnly
   * @type {Ember.ComputedProperty | Array}
   */
  errors: computed('attribute', '_errorContent.@each.errors', cycleBreaker(function () {
    return this._computeErrorCollection(get(this, '_errorContent'));
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
   * @type {Ember.ComputedProperty | Error}
   */
  error: computed('errors.[]', cycleBreaker(function () {
    return get(this, 'errors.0');
  })),

  /**
   * All built options of the validators associated with the results in this collection grouped by validator type
   *
   * ```javascript
   * // Given the following validators
   * {
   *   username: [
   *     validator('presence', true),
   *     validator('length', { max: 15 }),
   *     validator('format', { regex: /foo/ }),
   *     validator('format', { regex: /bar/ }),
   *   ]
   * }
   * ```
   *
   * ```js
   * get(user, 'validations.attrs.username.options')
   * ```
   *
   * The above will return the following
   * ```js
   * {
   *   'presence': { presence: true},
   *   'length': { max: 15 },
   *   'regex': [{ regex: /foo/ }, { regex: /bar/ }]
   * }
   * ```
   *
   * @property options
   * @readOnly
   * @type {Ember.ComputedProperty | Object}
   */
  options: computed('_contentValidators.[]', '_contentValidators.@each._cachedOptions', function () {
    return this._groupValidatorOptions();
  }),

  /**
   * @property value
   * @type {Ember.ComputedProperty}
   * @private
   */
  value: computed('isAsync', cycleBreaker(function () {
    return get(this, 'isAsync') ? get(this, '_promise') : this;
  })),

  /**
   * @property _promise
   * @async
   * @private
   * @type {Ember.ComputedProperty | Promise}
   */
  _promise: computed('content.@each._promise', cycleBreaker(function () {
    const promises = get(this, 'content').getEach('_promise');

    if (!isEmpty(promises)) {
      return RSVP.all(compact(flatten(promises)));
    }
  })),

  /**
   * @property _contentValidators
   * @type {Ember.ComputedProperty}
   * @private
   */
  _contentValidators: computed.mapBy('_errorContent', '_validator').readOnly(),

  /**
   * @property _errorContent
   * @type {Ember.ComputedProperty}
   * @private
   */
  _errorContent: computed.filter('content', function(result) {
    return get(result, 'isWarning') !== true;
  }).readOnly(),

  /**
   * @property _warningContent
   * @type {Ember.ComputedProperty}
   * @private
   */
  _warningContent: computed.filterBy('content', 'isWarning', true).readOnly(),


  /**
   * @method  _computeErrorCollection
   * @return  {Object}
   * @private
   */
  _computeErrorCollection(content) {
    const attribute = get(this, 'attribute');
    let errors = flatten(content.getEach('errors'));

    errors = uniq(compact(errors));
    errors.forEach(e => {
      if(e.get('attribute') !== attribute) {
        e.set('parentAttribute', attribute);
      }
    });

    return errors;
  },

  /**
   * Used by the `options` property to create a hash from the `content` that is grouped by validator type.
   * If there is more than 1 of a type, it groups it into an array of option objects.
   *
   * @method  _groupValidatorOptions
   * @return  {Object}
   * @private
   */
  _groupValidatorOptions() {
    const validators = get(this, 'content').getEach('_validator');

    return validators.reduce((options, v) => {
      if (isNone(v) || isNone(get(v, '_type'))) {
        return options;
      }

      const type = get(v, '_type');
      const vOpts = assign({}, get(v, '_cachedOptions'));

      if (options[type]) {
        if (isArray(options[type])) {
          options[type].push(vOpts);
        } else {
          options[type] = [options[type], vOpts];
        }
      } else {
        options[type] = vOpts;
      }
      return options;
    }, {});
  }
});
