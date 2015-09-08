/**
 * Copyright 2015, Yahoo! Inc.
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
  integration: true,
  setup: function() {
    validator = this.subject();
  }
});

test('no options', function(assert) {
  assert.expect(1);

  message = validator.validate();
  assert.equal(message, true);
});

test('allow blank', function(assert) {
  assert.expect(2);

  options = {
    allowBlank: true,
    type: 'email'
  };

  set(validator, 'options', options);
  validator.init();

  message = validator.validate();
  assert.equal(message, true);

  message = validator.validate('email');
  assert.equal(message, 'This field must be a valid email address');
});

test('email', function(assert) {
  assert.expect(3);

  options = {
    type: 'email'
  };

  set(validator, 'options', options);
  validator.init();

  assert.equal(validator.get('options').type, 'email');

  message = validator.validate('email');
  assert.equal(message, 'This field must be a valid email address');

  message = validator.validate('email@yahoo.com');
  assert.equal(message, true);
});

test('phone', function(assert) {
  assert.expect(3);

  options = {
    type: 'phone'
  };

  set(validator, 'options', options);
  validator.init();

  assert.equal(validator.get('options').type, 'phone');

  message = validator.validate('123');
  assert.equal(message, 'This field must be a valid phone number');

  message = validator.validate('(408) 555-1234');
  assert.equal(message, true);
});

test('url', function(assert) {
  assert.expect(3);

  options = {
    type: 'url'
  };

  set(validator, 'options', options);
  validator.init();

  assert.equal(validator.get('options').type, 'url');

  message = validator.validate('yahoo');
  assert.equal(message, 'This field must be a valid url');

  message = validator.validate('http://www.yahoo.com');
  assert.equal(message, true);
});

test('custom', function(assert) {
  assert.expect(3);

  options = {
    regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$/
  };

  set(validator, 'options', options);
  validator.init();

  assert.equal(validator.get('options').regex, options.regex);

  message = validator.validate('password');
  assert.equal(message, 'This field is invalid');

  message = validator.validate('Pass123');
  assert.equal(message, true);
});
