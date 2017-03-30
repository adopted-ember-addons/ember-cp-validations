import Base from 'ember-cp-validations/validators/base';
import { validate as _validate } from 'ember-validators';

export default Base.extend({
  validate() {
    let result = _validate(this.get('_evType'), ...arguments);

    if (result && typeof result === 'object') {
      return result.message ? result.message : this.createErrorMessage(result.type, result.value, result.context);
    }

    return result;
  }
});
