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

moduleFor('validator:length', 'Unit | Validator | length', {
  needs: ['validator:messages'],
  setup: function() {
    validator = this.subject();
  }
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
    min: 5
  };

  message = validator.validate('', options);
  assert.equal(message, true);

  message = validator.validate('test', options);
  assert.equal(message, 'This field is too short (minimum is 5 characters)');
});

test('allow none', function(assert) {
  assert.expect(2);

  options = {
    // default allowNone should be true
  };

  message = validator.validate(undefined, options);
  assert.equal(message, true);

  options.allowNone = false;

  message = validator.validate(null, options);
  assert.equal(message, 'This field is invalid');
});

test('is', function(assert) {
  assert.expect(2);

  options = {
    is: 4
  };

  message = validator.validate('testing', options);
  assert.equal(message, 'This field is the wrong length (should be 4 characters)');

  message = validator.validate('test', options);
  assert.equal(message, true);
});

test('min', function(assert) {
  assert.expect(2);

  options = {
    min: 5
  };

  message = validator.validate('test', options);
  assert.equal(message, 'This field is too short (minimum is 5 characters)');

  message = validator.validate('testing', options);
  assert.equal(message, true);
});

test('max', function(assert) {
  assert.expect(2);

  options = {
    max: 5
  };

  message = validator.validate('testing', options);
  assert.equal(message, 'This field is too long (maximum is 5 characters)');

  message = validator.validate('test', options);
  assert.equal(message, true);
});

test('array', function(assert) {
  assert.expect(2);

  options = {
    min: 1
  };

  message = validator.validate([], options);
  assert.equal(message, 'This field is too short (minimum is 1 characters)');

  message = validator.validate([1], options);
  assert.equal(message, true);
});
