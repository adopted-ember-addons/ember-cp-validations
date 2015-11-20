import DS from 'ember-data';
import {
  validator, buildValidations
}
from 'ember-cp-validations';


let Validations = buildValidations({
  name: validator('presence', true),
  acceptTerms: validator((value) => {
    return value || 'You must accept the terms.';
  }),
});


export default DS.Model.extend(Validations, {
  name: DS.attr('string', { defaultValue: '' }),
  acceptTerms: DS.attr('boolean', { defaultValue: false }),
});
