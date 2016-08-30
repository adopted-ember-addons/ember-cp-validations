import Base from 'ember-cp-validations/validators/base';
import { validate } from 'ember-validators';

export default Base.extend({
  validate() {
    const result = validate(this.get('_type'), ...arguments);

    if(result && typeof result === 'object') {
      return this.createErrorMessage(result.type, result.value, result.context);
    }

    return result;
  }
});
