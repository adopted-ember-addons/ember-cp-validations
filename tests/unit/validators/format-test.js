/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import {
  moduleFor, test
}
from 'ember-qunit';

var options, validator, message;
var set = Ember.set;

moduleFor('validator:format', 'Unit | Validator | format', {
  needs: ['validator:messages'],
  setup: function() {
    validator = this.subject();
  }
});

test('buildOptions', function(assert) {
  assert.expect(2);

  options = { type: 'email' };
  let builtOptions = validator.buildOptions(options, {});
  assert.equal(builtOptions.type, 'email');
  assert.ok(builtOptions.regex);
});

test('no options', function(assert) {
  assert.expect(1);

  message = validator.validate(undefined, {});
  assert.equal(message, true);
});

test('allow blank', function(assert) {
  assert.expect(2);

  options = {
    allowBlank: true,
    type: 'email'
  };
  options = validator.buildOptions(options, {});

  message = validator.validate(undefined, options);
  assert.equal(message, true);

  message = validator.validate('email', options);
  assert.equal(message, 'This field must be a valid email address');
});

test('email', function(assert) {
  assert.expect(3);

  options = {
    type: 'email'
  };

  options = validator.buildOptions(options, {});

  message = validator.validate('email', options);
  assert.equal(message, 'This field must be a valid email address');

  message = validator.validate('email@yahoo.com', options);
  assert.equal(message, true);

  message = validator.validate('email+example@yahoo.com', options);
  assert.equal(message, true);
});

test('phone', function(assert) {
  assert.expect(2);

  options = {
    type: 'phone'
  };

  options = validator.buildOptions(options, {});

  message = validator.validate('123', options);
  assert.equal(message, 'This field must be a valid phone number');

  message = validator.validate('(408) 555-1234', options);
  assert.equal(message, true);
});

test('url', function(assert) {
  assert.expect(2);

  options = {
    type: 'url'
  };

  options = validator.buildOptions(options, {});

  message = validator.validate('yahoo', options);
  assert.equal(message, 'This field must be a valid url');

  message = validator.validate('http://www.yahoo.com', options);
  assert.equal(message, true);
});

test('custom', function(assert) {
  assert.expect(2);

  options = {
    regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$/
  };

  options = validator.buildOptions(options, {});

  message = validator.validate('password', options);
  assert.equal(message, 'This field is invalid');

  message = validator.validate('Pass123', options);
  assert.equal(message, true);
});
