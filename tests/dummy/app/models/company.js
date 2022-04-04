import Model, { attr } from '@ember-data/model';
import { validator, buildValidations } from 'ember-cp-validations';

export const Validations = buildValidations({
  name: validator('presence', { presence: true, description: 'Name' }),
});

export default Model.extend(Validations, {
  name: attr('string'),
});
