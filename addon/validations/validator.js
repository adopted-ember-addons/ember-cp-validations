/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
import Ember from 'ember';

const {
  isNone
} = Ember;

/**
 * @module Validators
 * @main Validators
 */

/**
 * ### description
 *
 * Default: __'This field'__
 *
 * A descriptor for your attribute used in the error message strings.
 * You can overwrite this value in your `validators/messages.js` file by changing the `defaultDescription` property.
 *
 * ```javascript
 * // Examples
 * validator('date', {
 *   description: 'Date of birth'
 * })
 * // If validation is run and the attribute is empty, the error returned will be:
 * // 'Date of birth can't be blank'
 * ```
 *
 * ### lazy
 *
 * Default: __true__
 *
 * Only validate the given validator if the attribute is not already in an invalid
 * state. When you have multiple validators on an attribute, it will only validate subsequent
 * validators if the preceding validators have passed. When set to __false__, the validator
 * will always be executed, even if its preceding validators are invalid.
 *
 * ```javascript
 * // Examples
 * buildValidations({
 *  username: [
 *    validator('presence', true),
 *    validator('length', { min: 5 }),
 *    validator('custom-promise-based-validator') // Will only be executed if the above two have passed
 *  ]
 * });
 *
 * validator('custom-validator-that-must-executed', {
 *   lazy: false
 * })
 * ```
 *
 * ### dependentKeys
 *
 * A list of other model specific dependents for you validator.
 *
 * ```javascript
 * // Examples
 * validator('has-friends', {
 *   dependentKeys: ['model.friends.[]']
 * })
 * validator('has-valid-friends', {
 *   dependentKeys: ['model.friends.@each.username']
 * })
 * validator('x-validator', {
 *   dependentKeys: ['model.username', 'model.email', 'model.meta.foo.bar']
 * })
 * ```
 *
 * ### disabled
 *
 * Default: __false__
 *
 * If set to __true__, disables the given validator.
 *
 * ```js
 * // Examples
 * validator('presence', {
 *   presence: true,
 *   disabled: true
 * })
 * validator('presence', {
 *   presence: true,
 *   disabled: computed.not('model.shouldValidate')
 * })
 * ```
 *
 * ### debounce
 *
 * Default: __0__
 *
 * Debounces the validation with the given time in `milliseconds`. All debounced validations will
 * be handled asynchronously (wrapped in a promise).
 *
 * ```javascript
 * // Examples
 * validator('length', {
 *   debounce: 500
 * })
 * validator('x-validator', {
 *   debounce: 250
 * })
 * ```
 *
 * ### isWarning
 *
 * Default: __false__
 *
 * Any validator can be declared as a warning validator by setting `isWarning` to true. These validators will act as
 * assertions that when return a message, will be placed under `warnings` and `warningMessages` collections. What this means,
 * is that these validators will not have any affect on the valid state of the attribute allowing you to display warning messages
 * even when the attribute is valid.
 *
 * ```javascript
 * // Examples
 * validator('length', {
 *   isWarning: true,
 *   min: 6,
 *   message: 'Password is weak'
 * })
 * ```
 *
 * ### volatile
 *
 * Default: __false__
 *
 * If any validator sets the volatile option to **true** (including options, default options, and global options),
 * it will place the entire attribute's CP in a volatile state. This means that it will set it into non-cached mode.
 * When in this mode the computed property will not automatically cache the return value.
 *
 * Dependency keys have no effect on volatile properties as they are for cache invalidation and notification when
 * cached value is invalidated. Any changes to the dependents will not refire validations.
 *
 * __**WARNING: This option should only be used if you know what you're doing**__
 *
 * ```javascript
 * // Examples
 * validator('length', {
 *   volatile: true
 * })
 * ```
 *
 * ### value
 *
 * Used to retrieve the value to validate. This will overwrite the validator's default `value` method.
 * By default this returns `model[attribute]`. If you are dependent on other model attributes, you will
 * need to add them as `dependentKeys`.
 *
 * ```javascript
 * // Examples
 * validator('date', {
 *   value(model, attribute) {
 *   	// Format the original value before passing it into the validator
 *   	return moment().utc(model.get(attribute)).format('DD/MM/YYY');
 *   }
 * })
 * validator('number', {
 *   dependentKeys: ['someOtherAttr'],
 *   value(model, attribute) {
 *    // Validate a value that is not the current attribute
 *    return this.get('model').get('someOtherAttr');
 *   }
 * })
 * ```
 *
 * ### message
 *
 * This option can take two forms. It can either be a `string` (a CP that returns a string is also valid), or a `function`.
 * If a string is used, then it will overwrite all error message types for the specified validator.
 *
 * ```javascript
 * // Example: String
 * validator('confirmation', {
 *   message: 'Email does not match {attribute}. What are you even thinking?!'
 * })
 * ```
 *
 * We can pass a `function` into our message option for even more customization capabilities.
 *
 * ```javascript
 * // Example: Function
 * validator('date', {
 *   message(type, options, value, context) {
 *     if (type === 'before') {
 *       return '{description} should really be before {date}';
 *     }
 *     if (type === 'after') {
 *       return '{description} should really be after {date}';
 *     }
 *   }
 * })
 * ```
 * The message function is given the following arguments:
 *
 * - `type` (**String**): The error message type
 * - `options` (**Object**): The validator options that were defined in the model
 * - `value`: The current value being evaluated
 * - `context` (**Object**): Context for string replacement
 *
 * The return value must be a `string`. If nothing is returned (`undefined`),
 * defaults to the default error message of the specified type.
 *
 * Within this function, the context is set to that of the current validator.
 * This gives you access to the model, defaultMessages, options and more.
 *
 *
 * @module Validators
 * @submodule Common Options
 */

export default function(arg1, options) {
  let props = {
    options: isNone(options) ? {} : options
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
