import Base from 'ember-cp-validations/validators/base';
import { validate } from 'ember-validators';

export default class EmberValidator extends Base {
  validate() {
    let result = validate(this._evType, ...arguments);

    if (result && typeof result === 'object') {
      return result.message
        ? result.message
        : this.createErrorMessage(result.type, result.value, result.context);
    }

    return result;
  }
}
