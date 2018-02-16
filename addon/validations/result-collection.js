import { not, readOnly, notEmpty, mapBy } from '@ember/object/computed';
import ArrayProxy from '@ember/array/proxy';
import RSVP from 'rsvp';
import { computed, set, get } from '@ember/object';
import { isNone } from '@ember/utils';
import { A as emberArray, isArray } from '@ember/array';
import cycleBreaker from '../utils/cycle-breaker';
import { flatten, uniq, compact } from '../utils/array';

/*
  CP Macros
 */
function isAny(collection, key, value, defaultValue) {
  return computed(
    `${collection}.@each.${key}`,
    cycleBreaker(function() {
      return get(this, collection).isAny(key, value);
    }, defaultValue)
  );
}

function isEvery(collection, key, value, defaultValue) {
  return computed(
    `${collection}.@each.${key}`,
    cycleBreaker(function() {
      return get(this, collection).isEvery(key, value);
    }, defaultValue)
  );
}

/**
 * @module Validations
 * @class ResultCollection
 */
export default ArrayProxy.extend({
  init() {
    set(this, 'content', emberArray(compact(get(this, 'content'))));
    this._super(...arguments);
  },

  /**
   * The attribute that this collection belongs to
   *
   * @property attribute
   * @type {String}
   */
  attribute: null,

  /**
   * ```javascript
   * // Examples
   * get(user, 'validations.isInvalid')
   * get(user, 'validations.attrs.username.isInvalid')
   * ```
   *
   * @property isInvalid
   * @default false
   * @readOnly
   * @type {Boolean}
   */
  isInvalid: not('isValid').readOnly(),

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
   * @type {Boolean}
   */
  isValid: isEvery('content', 'isValid', true, true).readOnly(),

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
   * @type {Boolean}
   */
  isValidating: isAny('content', 'isValidating', true, false).readOnly(),

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
   * @type {Boolean}
   */
  isTruelyValid: isEvery('content', 'isTruelyValid', true, true).readOnly(),

  /**
   * Will be true only if isValid is `false` and isValidating is `false`
   *
   * ```javascript
   * // Examples
   * get(user, 'validations.isTruelyInvalid')
   * get(user, 'validations.attrs.username.isTruelyInvalid')
   * ```
   *
   * @property isTruelyInvalid
   * @default false
   * @readOnly
   * @type {Boolean}
   */
  isTruelyInvalid: isAny('content', 'isTruelyInvalid', true, false).readOnly(),

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
   * @type {Boolean}
   */
  isDirty: isAny('content', 'isDirty', true, false).readOnly(),

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
   * @type {Boolean}
   */
  isAsync: isAny('content', 'isAsync', true, false).readOnly(),

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
   * @type {Array}
   */
  messages: computed(
    'content.@each.messages',
    cycleBreaker(function() {
      return uniq(compact(flatten(this.getEach('messages'))));
    })
  ).readOnly(),

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
   * @type {String}
   */
  message: readOnly('messages.firstObject'),

  /**
   * Will be `true` if there are warnings in the collection.
   *
   * ```javascript
   * // Example
   * get(user, 'validations.hasWarnings')
   * get(user, 'validations.attrs.username.hasWarnings')
   * ```
   *
   * @property hasWarnings
   * @readOnly
   * @type {String}
   */
  hasWarnings: notEmpty('warningMessages').readOnly(),

  /**
   * A collection of all warning messages on the object in question
   *
   * ```javascript
   * // Examples
   * get(user, 'validations.warningMessages')
   * get(user, 'validations.attrs.username.warningMessages')
   * ```
   *
   * @property warningMessages
   * @readOnly
   * @type {Array}
   */
  warningMessages: computed(
    'content.@each.warningMessages',
    cycleBreaker(function() {
      return uniq(compact(flatten(this.getEach('warningMessages'))));
    })
  ).readOnly(),

  /**
   * An alias to the first message in the warningMessages collection.
   *
   * ```javascript
   * // Example
   * get(user, 'validations.warningMessage')
   * get(user, 'validations.attrs.username.warningMessage')
   * ```
   *
   * @property warningMessage
   * @readOnly
   * @type {String}
   */
  warningMessage: readOnly('warningMessages.firstObject'),

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
   * @type {Array}
   */
  warnings: computed(
    'attribute',
    'content.@each.warnings',
    cycleBreaker(function() {
      return this._computeErrorCollection(this.getEach('warnings'));
    })
  ).readOnly(),

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
   * @type {Error}
   */
  warning: readOnly('warnings.firstObject'),

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
   * @type {Array}
   */
  errors: computed(
    'attribute',
    'content.@each.errors',
    cycleBreaker(function() {
      return this._computeErrorCollection(this.getEach('errors'));
    })
  ).readOnly(),

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
   * @type {Error}
   */
  error: readOnly('errors.firstObject'),

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
   * @type {Object}
   */
  options: computed('_contentValidators.@each.options', function() {
    return this._groupValidatorOptions(get(this, '_contentValidators'));
  }).readOnly(),

  /**
   * @property _promise
   * @async
   * @private
   * @type {Promise}
   */
  _promise: computed(
    'content.@each._promise',
    '_contentResults.@each._promise',
    cycleBreaker(function() {
      return RSVP.allSettled(
        compact(
          flatten([
            this.get('_contentResults').getEach('_promise'),
            this.getEach('_promise')
          ])
        )
      );
    })
  ).readOnly(),

  /**
   * @property _contentResults
   * @type {Array}
   * @private
   */
  _contentResults: computed('content.@each._result', function() {
    return emberArray(compact(this.getEach('_result')));
  }).readOnly(),

  /**
   * @property _contentValidators
   * @type {Array}
   * @private
   */
  _contentValidators: mapBy('content', '_validator').readOnly(),

  _computeErrorCollection(collection = []) {
    let attribute = get(this, 'attribute');
    let errors = uniq(compact(flatten(collection)));

    errors.forEach(e => {
      if (attribute && e.get('attribute') !== attribute) {
        e.set('parentAttribute', attribute);
      }
    });

    return errors;
  },

  /**
   * Used by the `options` property to create a hash from the `content` that is grouped by validator type.
   * If there is more than 1 of a type, it groups it into an array of option objects.
   */
  _groupValidatorOptions(validators = []) {
    return validators.reduce((options, v) => {
      if (isNone(v) || isNone(get(v, '_type'))) {
        return options;
      }

      let type = get(v, '_type');
      let vOpts = get(v, 'options').toObject();

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
