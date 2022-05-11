import {
  validator,
  buildValidations,
} from '@eflexsystems/ember-tracked-validations';
import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

@buildValidations({
  type: {
    description: 'Order Line Type',
    validators: [validator('ds-error'), validator('presence', true)],
  },
  order: {
    description: 'Order',
    validators: [validator('ds-error'), validator('presence', true)],
  },
  selections: {
    description: 'Order Selections',
    validators: [
      validator('ds-error'),
      validator('has-many'),
      validator('presence', true),
    ],
  },
})
export default class OrderLine extends Model {
  @belongsTo('order', { async: false }) order;
  @hasMany('order-selection', { async: false }) selection;
  @attr('string') type;
}
