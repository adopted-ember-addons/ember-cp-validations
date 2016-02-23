/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import moment from 'moment';

import {
  moduleFor, test
}
from 'ember-qunit';

var options, validator, message;
var set = Ember.set;

moduleFor('validator:date', 'Unit | Validator | date', {
  needs: ['validator:messages'],
  setup: function() {
    validator = this.subject();
  }
});

test('no options', function(assert) {
  assert.expect(1);

  options = {};
  message = validator.validate(undefined, options);
  assert.equal(message, true);
});

test('allow blank', function(assert) {
  assert.expect(2);

  options = {
    allowBlank: true,
    before: '1/1/2015'
  };

  message = validator.validate('', options);
  assert.equal(message, true);

  message = validator.validate('1/1/2016', options);
  assert.equal(message, 'This field must be before Jan 1st, 2015');
});

test('valid date', function(assert) {
  assert.expect(2);

  options = {};

  message = validator.validate('abc', options);
  assert.equal(message, 'This field must be a valid date');

  message = validator.validate(new Date(), options);
  assert.equal(message, true);
});

test('valid input date format', function(assert) {
  assert.expect(2);

  options = {
    format: 'M/D/YYYY'
  };

  message = validator.validate('1/1/15', options);
  assert.equal(message, 'This field must be in the format of M/D/YYYY');

  message = validator.validate('1/1/2015', options);
  assert.equal(message, true);
});

test('error date format', function(assert) {
  assert.expect(1);

  options = {
    errorFormat: 'M/D/YYYY',
    before: '1/1/2015'
  };

  message = validator.validate('1/1/2016', options);
  assert.equal(message, 'This field must be before 1/1/2015');
});

test('before', function(assert) {
  assert.expect(2);

  options = {
    before: '1/1/2015'
  };

  message = validator.validate('1/1/2016', options);
  assert.equal(message, 'This field must be before Jan 1st, 2015');

  message = validator.validate('1/1/2014', options);
  assert.equal(message, true);
});

test('before now', function(assert) {
  assert.expect(2);
  var now = moment().format('MMM Do, YYYY');
  options = {
    before: 'now'
  };
  message = validator.validate('1/1/3015', options);
  assert.equal(message, `This field must be before ${now}`);

  message = validator.validate('1/1/2014', options);
  assert.equal(message, true);
});

test('after', function(assert) {
  assert.expect(2);

  options = {
    after: '1/1/2015'
  };

  message = validator.validate('1/1/2014', options);
  assert.equal(message, 'This field must be after Jan 1st, 2015');

  message = validator.validate('1/1/2016', options);
  assert.equal(message, true);
});

test('after now', function(assert) {
  assert.expect(2);
  var now = moment().format('MMM Do, YYYY');
  options = {
    after: 'now'
  };

  message = validator.validate('1/1/2014', options);
  assert.equal(message, `This field must be after ${now}`);

  message = validator.validate('1/1/3015', options);
  assert.equal(message, true);
});
