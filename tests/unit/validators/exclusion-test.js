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

moduleFor('validator:exclusion', 'Unit | Validator | exclusion', {
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
    "in": ["foo", "bar", "baz"]
  };
  message = validator.validate('', options);
  assert.equal(message, true);

  message = validator.validate('foo', options);
  assert.equal(message, 'This field is reserved');
});

test('not in array', function(assert) {
  assert.expect(4);

  options = {
    "in": ["foo", "bar", "baz"]
  };


  message = validator.validate('foo', options);
  assert.equal(message, 'This field is reserved');

  message = validator.validate('bar', options);
  assert.equal(message, 'This field is reserved');

  message = validator.validate('baz', options);
  assert.equal(message, 'This field is reserved');

  message = validator.validate('test', options);
  assert.equal(message, true);
});

test('not in range', function(assert) {
  assert.expect(5);

  options = {
    range: [1, 10]
  };

  message = validator.validate(1, options);
  assert.equal(message, "This field is reserved");

  message = validator.validate(5, options);
  assert.equal(message, "This field is reserved");

  message = validator.validate(10, options);
  assert.equal(message, "This field is reserved");

  message = validator.validate(0, options);
  assert.equal(message, true);

  message = validator.validate(100, options);
  assert.equal(message, true);
});

test('range type check - number', function(assert) {
  assert.expect(4);

  options = {
    range: [1, 10]
  };

  message = validator.validate(1, options);
  assert.equal(message, "This field is reserved");

  message = validator.validate(5, options);
  assert.equal(message, "This field is reserved");

  message = validator.validate('1', options);
  assert.equal(message, true);

  message = validator.validate('5', options);
  assert.equal(message, true);
});

test('range type check - string', function(assert) {
  assert.expect(4);

  options = {
    range: ['a', 'z']
  };

  message = validator.validate('a', options);
  assert.equal(message, "This field is reserved");

  message = validator.validate('z', options);
  assert.equal(message, "This field is reserved");

  message = validator.validate(97, options);
  assert.equal(message, true);

  message = validator.validate('zzz', options);
  assert.equal(message, true);
});
