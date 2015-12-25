/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import DS from 'ember-data';
import {
  validator, buildValidations
}
from 'ember-cp-validations';

var attr = DS.attr;

var Validations = buildValidations({
  username: [
    validator('presence', true),
    validator('length', {
      debounce: 500,
      max: 15
    })
  ],
  password: {
    description: 'Password',
    debounce: 500,
    validators: [
      validator('presence', true),
      validator('length', {
        min: 4,
        max: 8
      }),
      validator('format', {
        regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$/,
        message: ' '
      })
    ]
  },
  email: [
    validator('presence', true),
    validator('format', {
      type: 'email'
    })
  ],
  emailConfirmation: validator('confirmation', {
    on: 'email',
    message: 'Email addresses do not match'
  }),
  details: validator('belongs-to')
});

export default DS.Model.extend(Validations, {
  'username': attr('string'),
  'password': attr('string'),
  'email': attr('string'),
  'details': DS.belongsTo('user-detail')
});
