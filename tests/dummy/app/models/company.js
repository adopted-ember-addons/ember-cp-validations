import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import {
  hasValidations,
  validator,
  buildValidations
} from 'ember-cp-validations';

export const Validations = buildValidations({
  name: validator('presence', { presence: true, description: 'Name' })
});

@hasValidations(Validations)
export default class Company extends Model {
  @attr('string') name;
}
