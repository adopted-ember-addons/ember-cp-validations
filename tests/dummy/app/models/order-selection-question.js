import { validator, buildValidations } from 'ember-cp-validations';
import Model, { attr, belongsTo } from '@ember-data/model';

@buildValidations({
  order: {
    description: 'Order',
    validators: [validator('ds-error'), validator('presence', true)],
  },
  selection: {
    description: 'Order Selection',
    validators: [validator('ds-error'), validator('presence', true)],
  },
  text: {
    description: 'Question Text',
    validators: [validator('ds-error'), validator('presence', true)],
  },
})
export default class OrderSelectionQuestion extends Model {
  @belongsTo('order', { async: true }) order;
  @belongsTo('order-selection', { async: true }) selection;
  @attr('string') text;
}
