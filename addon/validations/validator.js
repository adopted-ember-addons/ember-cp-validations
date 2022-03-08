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
 * ### value
 *
 * Used to retrieve the value to validate. This will overwrite the validator's default `value` method.
 * By default this returns `model[attribute]`.
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

export default function (_type, options = {}) {
  return {
    options,
    _type,
  };
}
