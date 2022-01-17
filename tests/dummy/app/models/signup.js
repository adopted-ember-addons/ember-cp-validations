import { validator, buildValidations } from 'ember-cp-validations';
import Model, { attr } from '@ember-data/model';

@buildValidations({
  name: validator('presence', true),
  acceptTerms: validator('inline', {
    validate(value) {
      return value || 'You must accept the terms.';
    },
  }),
})
export default class Signup extends Model {
  @attr('string', { defaultValue: '' }) name;
  @attr('boolean', { defaultValue: false }) acceptTerms;
}
