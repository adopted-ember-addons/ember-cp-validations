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
  firstName: validator('presence', true),

  lastName: [
    validator('presence', true),
    validator('dependent', {
      on: ['firstName']
    })
  ],

  dob: {
    description: 'Date of  birth',
    validators: [
      validator('presence', true),
      validator('date', {
        before: 'now',
        after: '1/1/1900',
        format() {return 'M/D/YYYY'; },
        message: function(type, value, context) {
          if (type === 'before') {
            return '{description} should really be before {before}';
          }
          if (type === 'after') {
            return '{description} should really be after {after}';
          }
        }
      })
  ]},

  phone: [
    validator('format', {
      type: 'phone',
      allowBlank: true
    })
  ],

  url: [
    validator('format', {
      type: 'url',
      allowBlank: true
    })
  ]

});

export default DS.Model.extend(Validations, {
  "firstName": attr('string'),
  "lastName": attr('string'),
  "dob": attr('date'),
  "phone": attr('string'),
  "url": attr('string')
});
