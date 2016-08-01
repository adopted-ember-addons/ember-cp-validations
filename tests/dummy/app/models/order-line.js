import DS from 'ember-data';
import {
  validator, buildValidations
}
from 'ember-cp-validations';

const Validations = buildValidations({
  type: {
    description: "Order Line Type",
    validators: [
      validator('ds-error'),
      validator('presence', true)
    ]
  },
  order: {
    description: "Order",
    validators: [
      validator('ds-error'),
      validator('presence', true)
    ]
  },
  selections: {
    description: "Order Selections",
    validators: [
      validator('ds-error'),
      validator('has-many'),
      validator('presence', true)
    ]
  }
});

export default DS.Model.extend(Validations, {
  order: DS.belongsTo('order', { async: true }),
  selections: DS.hasMany('order-selection', { async: true }),
  type: DS.attr('string')
});