import DS from 'ember-data';
import {
  hasValidations,
  validator,
  buildValidations
} from 'ember-cp-validations';

const { attr, Model } = DS;

export const Validations = buildValidations({
  name: validator('presence', { presence: true, description: 'Name' })
});

export default
@hasValidations(Validations)
class Company extends Model {
  @attr('string') name;
}
