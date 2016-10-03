import Base from 'ember-cp-validations/validators/base';
import { validate as _validate } from 'ember-validators';

export default Base.extend({
  validate() {
    let result = _validate(this.get('_type'), ...arguments);

    if (result && typeof result === 'object') {
      return this.createErrorMessage(result.type, result.value, result.context);
    }

    return result;
  }
});
