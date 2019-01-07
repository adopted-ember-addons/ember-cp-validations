/**
 * Decorator that allows you to mixin validations when using es6 style model classes
 *
 * Usage:
 *
 * import { hasValidations } from 'ember-cp-validations';
 *
 * @hasValidations(Validations)
 * export default class YourModel extends Model {
 *    @attr('string') name
 * };
 *
 *
 * @param validations
 * @returns {decorator}
 */

export function hasValidations(validations) {
  return desc => {
    return {
      ...desc,
      finisher(klass) {
        klass.prototype.reopen(validations);

        return klass;
      }
    };
  };
}
