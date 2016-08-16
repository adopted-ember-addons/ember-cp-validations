/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

 // BEGIN-SNIPPET user-model
import DS from 'ember-data';
import { validator, buildValidations } from 'ember-cp-validations';

const { attr } = DS;

var Validations = buildValidations({
  username: {
    description: 'Username',
    validators: [
      validator('presence', true),
      validator('length', {
        min: 5,
        max: 15
      })
    ]
  },
  password: {
    description: 'Password',
    validators: [
      validator('presence', true),
      validator('length', {
        min: 4,
        max: 10
      }),
      validator('format', {
        regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$/,
        message: '{description} must include at least one upper case letter, one lower case letter, and a number'
      }),
      validator('length', {
        isWarning: true,
        min: 6,
        message: 'What kind of weak password is that?'
      })
    ]
  },
  email: {
    validators: [
      validator('presence', true),
      validator('format', {
        type: 'email'
      })
    ]
  },
  emailConfirmation: validator('confirmation', {
    on: 'email',
    message: 'Email addresses do not match'
  }),
  details: validator('belongs-to')
}, {
  debounce: 0
});

export default DS.Model.extend(Validations, {
  username: attr('string'),
  password: attr('string'),
  email: attr('string'),
  details: DS.belongsTo('user-detail')
});
// END-SNIPPET
