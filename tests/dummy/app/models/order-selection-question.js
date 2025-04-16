import Model, { attr, belongsTo } from '@ember-data/model';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations(
  {
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
  },
  {
    debounce: 10,
  },
);

export default Model.extend(Validations, {
  order: belongsTo('order', { async: true, inverse: 'questions' }),
  selection: belongsTo('order-selection', {
    async: true,
    inverse: 'questions',
  }),
  text: attr('string'),
});
