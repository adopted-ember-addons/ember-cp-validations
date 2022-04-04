import Model, { attr } from '@ember-data/model';
import { validator, buildValidations } from 'ember-cp-validations';

let Validations = buildValidations({
  name: validator('presence', true),
  acceptTerms: validator('inline', {
    validate(value) {
      return value || 'You must accept the terms.';
    },
  }),
});

export default Model.extend(Validations, {
  name: attr('string', { defaultValue: '' }),
  acceptTerms: attr('boolean', { defaultValue: false }),
});
