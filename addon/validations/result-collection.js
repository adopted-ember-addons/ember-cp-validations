import ArrayProxy from '@ember/array/proxy';
import RSVP from 'rsvp';
import { isNone, isPresent } from '@ember/utils';
import { A as emberArray, isArray } from '@ember/array';
import cycleBreaker from '../utils/cycle-breaker';
import { uniq, compact } from '../utils/array';
import { tracked } from '@glimmer/tracking';

/**
 * @module Validations
 * @class ResultCollection
 */
export default class ValidationsResultCollection extends ArrayProxy {
  constructor() {
    super(...arguments);
    this.content = emberArray(compact(this.content));
  }

  @tracked content = [];

  /**
   * The attribute that this collection belongs to
   *
   * @property attribute
   * @type {String}
   */
  @tracked attribute;

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
  get isInvalid() {
    return !this.isValid;
  }

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
  get isValid() {
    return cycleBreaker(() => this.content.isEvery('isValid', true), true);
  }

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
  get isValidating() {
    return cycleBreaker(() => this.content.isAny('isValidating', true), false);
  }

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
  get isTruelyValid() {
    return cycleBreaker(
      () => this.content.isEvery('isTruelyValid', true),
      true
    );
  }

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
  get isTruelyInvalid() {
    return cycleBreaker(
      () => this.content.isAny('isTruelyInvalid', true),
      false
    );
  }

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
  get isAsync() {
    return cycleBreaker(() => this.content.isAny('isAsync', true), false);
  }

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
  get messages() {
    return cycleBreaker(() =>
      uniq(compact(this.getEach('messages').flat(Infinity)))
    );
  }

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
  get message() {
    return this.messages.firstObject;
  }

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
  get hasWarnings() {
    return isPresent(this.warningMessages);
  }

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
  get warningMessages() {
    return cycleBreaker(() =>
      uniq(compact(this.getEach('warningMessages').flat(Infinity)))
    );
  }

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
  get warningMessage() {
    return this.warningMessages.firstObject;
  }

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
  get warnings() {
    return cycleBreaker(() =>
      this._computeErrorCollection(this.getEach('warnings'))
    );
  }

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
  get warning() {
    return this.warnings.firstObject;
  }

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
  get errors() {
    return cycleBreaker(() =>
      this._computeErrorCollection(this.getEach('errors'))
    );
  }

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
  get error() {
    return this.errors.firstObject;
  }

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
  get options() {
    return this._groupValidatorOptions(this._contentValidators);
  }

  /**
   * @property _promise
   * @async
   * @private
   * @type {Promise}
   */
  get _promise() {
    return cycleBreaker(() =>
      RSVP.allSettled(
        compact(
          [
            this._contentResults.getEach('_promise'),
            this.getEach('_promise'),
          ].flat(Infinity)
        )
      )
    );
  }

  /**
   * @property _contentResults
   * @type {Array}
   * @private
   */
  get _contentResults() {
    return emberArray(compact(this.getEach('_result')));
  }

  /**
   * @property _contentValidators
   * @type {Array}
   * @private
   */
  get _contentValidators() {
    return this.content.mapBy('_validator');
  }

  _computeErrorCollection(collection = []) {
    let attribute = this.attribute;
    let errors = uniq(compact(collection.flat(Infinity)));

    errors.forEach((e) => {
      if (attribute && e.get('attribute') !== attribute) {
        e.set('parentAttribute', attribute);
      }
    });

    return errors;
  }

  /**
   * Used by the `options` property to create a hash from the `content` that is grouped by validator type.
   * If there is more than 1 of a type, it groups it into an array of option objects.
   */
  _groupValidatorOptions(validators = []) {
    return validators.reduce((options, v) => {
      if (isNone(v) || isNone(v._type)) {
        return options;
      }

      let type = v._type;
      let vOpts = v.options.toObject();

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
}
