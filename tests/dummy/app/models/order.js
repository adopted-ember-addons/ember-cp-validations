import { validator, buildValidations } from 'ember-cp-validations';
import Model, { attr, hasMany } from '@ember-data/model';

@buildValidations({
  source: {
    description: 'Order Source',
    validators: [validator('ds-error'), validator('presence', true)],
  },
  lines: {
    description: 'Order Lines',
    validators: [
      validator('ds-error'),
      validator('has-many'),
      validator('presence', true),
    ],
  },
})
export default class Order extends Model {
  @attr('string') source;
  @hasMany('order-line', { async: true }) lines;
}
