import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  quantity: {
    description: 'Quantity',
    validators: [
      validator('ds-error'),
      validator('number', {
        gte: 1,
      }),
    ],
  },
  order: {
    description: 'Order',
    validators: [
      validator('ds-error'),
      validator('belongs-to'),
      validator('presence', true),
    ],
  },
  line: {
    description: 'Order Line',
    validators: [validator('ds-error'), validator('presence', true)],
  },
  questions: {
    description: 'Order Selection Questions',
    validators: [
      validator('ds-error'),
      validator('has-many'),
      validator('length', {
        min: 1,
      }),
    ],
  },
});

export default Model.extend(Validations, {
  order: belongsTo('order', { async: true, inverse: 'selections' }),
  line: belongsTo('order-line', { async: true, inverse: 'selections' }),
  questions: hasMany('order-selection-question', {
    async: true,
    inverse: 'selection',
  }),
  quantity: attr('number'),
});
