import Model, { attr, hasMany } from '@ember-data/model';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
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
});

export default Model.extend(Validations, {
  source: attr('string'),
  lines: hasMany('order-line', { async: true, inverse: 'order' }),
  questions: hasMany('order-selection-question', {
    async: true,
    inverse: 'order',
  }),
  selections: hasMany('order-selection', {
    async: true,
    inverse: 'order',
  }),
});
