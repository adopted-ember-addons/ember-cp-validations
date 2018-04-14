import Model from 'ember-data/model';
import { attr } from 'ember-decorators/data';
import {
  hasValidations,
  validator,
  buildValidations
} from 'ember-cp-validations';

const Validations = buildValidations({
  name: validator('presence', { presence: true, description: 'Name' })
});

@hasValidations(Validations)
export default class Company extends Model {
  @attr('string') name;
}
