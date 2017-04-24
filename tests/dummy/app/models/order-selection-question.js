import DS from 'ember-data';
import {
  validator, buildValidations
}
from 'ember-cp-validations';

const Validations = buildValidations({
  order: {
    description: 'Order',
    validators: [
      validator('ds-error'),
      validator('presence', true)
    ]
  },
  selection: {
    description: 'Order Selection',
    validators: [
      validator('ds-error'),
      validator('presence', true)
    ]
  },
  text: {
    description: 'Question Text',
    validators: [
      validator('ds-error'),
      validator('presence', { presence: true, debounce: 0 })
    ]
  }
});

export default DS.Model.extend(Validations, {
  order: DS.belongsTo('order', { async: true }),
  selection: DS.belongsTo('order-selection', { async: true }),
  text: DS.attr('string')
});
