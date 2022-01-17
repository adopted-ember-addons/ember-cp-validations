import BaseValidator from 'ember-cp-validations/validators/base';

const <%= classifiedModuleName %> = BaseValidator.extend({
  validate(/*value, options, model, attribute*/) {
    return true;
  }
});

export default <%= classifiedModuleName %>;
