import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
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
});

export default Model.extend(Validations, {
  order: belongsTo('order', { async: true, inverse: 'lines' }),
  selections: hasMany('order-selection', { async: true, inverse: 'line' }),
  type: attr('string'),
});
