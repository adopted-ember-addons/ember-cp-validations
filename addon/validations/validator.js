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
 * A descriptor for your attribute used in the error message strings. Defaults to `This field'`.
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
 * If set to `true`, disables the given validator. This option would usually go hand-in-hand
 * with {{#crossLinkModule 'Advanced Usage'}}options as functions{{/crossLinkModule}} and `dependentKeys`.
 * Defaults to `false`.
 *
 * ```js
 * // Examples
 * validator('presence', {
 *   presence: true,
 *   disabled: true
 * })
 * validator('presence', {
 *   presence: true,
 *   dependentKeys: ['shouldValidate'],
 *   disabled(model, attribute) {
 *     return !model.get('shouldValidate');
 *   }
 * })
 * ```
 *
 * ### debounce
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
 *   	// Format the orignal value before passing it into the validator
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

export default function (arg1, options) {
  const props = {
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
