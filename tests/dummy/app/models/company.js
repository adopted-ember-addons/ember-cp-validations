import {
  validator,
  buildValidations,
} from '@eflexsystems/ember-tracked-validations';
import Model, { attr } from '@ember-data/model';

@buildValidations({
  name: validator('presence', { presence: true, description: 'Name' }),
})
export default class Company extends Model {
  @attr('string') name;
}
