import DS from 'ember-data';
import {
  validator, buildValidations
}
from 'ember-cp-validations';

const Validations = buildValidations({
  quantity: {
    description: "Quantity",
    validators: [
      validator('ds-error'),
      validator('number', {
        gte: 1
      })
    ]
  },
  order: {
    description: "Order",
    validators: [
      validator('ds-error'),
      validator('belongs-to'),
      validator('presence', true)
    ]
  },
  line: {
    description: "Order Line",
    validators: [
      validator('ds-error'),
      validator('presence', true)
    ]
  },
  questions: {
    description: "Order Selection Questions",
    validators: [
      validator('ds-error'),
      validator('has-many'),
      validator('length', {
        min: 1
      })
    ]
  }
});

export default DS.Model.extend(Validations, {
  order: DS.belongsTo('order', { async: true }),
  line: DS.belongsTo('order-line', { async: true }),
  questions: DS.hasMany('order-selection-question', { async: true }),
  quantity: DS.attr('number')
});
