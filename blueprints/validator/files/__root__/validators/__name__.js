import BaseValidator from '@eflexsystems/ember-tracked-validations/validators/base';

const <%= classifiedModuleName %> = BaseValidator.extend({
  validate(/*value, options, model, attribute*/) {
    return true;
  }
});

export default <%= classifiedModuleName %>;
