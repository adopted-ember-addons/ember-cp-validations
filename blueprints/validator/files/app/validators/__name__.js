import BaseValidator from 'ember-cp-validations/validators/base';

const <%= classifiedModuleName %> = BaseValidator.extend({
  validate(/*value, options, model, attribute*/) {
    return true;
  }
});

<%= classifiedModuleName %>.reopenClass({
  /**
   * Define attribute specific dependent keys for your validator
   *
   * @param {String}  attribute   The attribute being evaluated
   * @param {Unknown} options     Options passed into your validator
   * @return {Array}
   */
  getDependentsFor(/* attribute, options */) {
    return [];
  }
});

export default <%= classifiedModuleName %>;
