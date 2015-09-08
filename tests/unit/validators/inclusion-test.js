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

moduleFor('validator:inclusion', 'Unit | Validator | inclusion', {
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
    "in": ["foo", "bar", "baz"]
  };
  set(validator, 'options', options);
  message = validator.validate();
  assert.equal(message, true);

  message = validator.validate('test');
  assert.equal(message, 'This field is not included in the list');
});

test('in array', function(assert) {
  assert.expect(4);

  options = {
    "in": ["foo", "bar", "baz"]
  };

  set(validator, 'options', options);

  message = validator.validate('test');
  assert.equal(message, 'This field is not included in the list');

  message = validator.validate('foo');
  assert.equal(message, true);

  message = validator.validate('bar');
  assert.equal(message, true);

  message = validator.validate('baz');
  assert.equal(message, true);
});

test('in range', function(assert) {
  assert.expect(5);

  options = {
    range: [1, 10]
  };

  set(validator, 'options', options);

  message = validator.validate(0);
  assert.equal(message, 'This field is not included in the list');

  message = validator.validate(100);
  assert.equal(message, 'This field is not included in the list');

  message = validator.validate(1);
  assert.equal(message, true);

  message = validator.validate(5);
  assert.equal(message, true);

  message = validator.validate(10);
  assert.equal(message, true);
});

test('range type check - number', function(assert) {
  assert.expect(7);

  options = {
    range: [1, 10]
  };

  set(validator, 'options', options);

  message = validator.validate('0');
  assert.equal(message, 'This field is not included in the list');

  message = validator.validate(0);
  assert.equal(message, 'This field is not included in the list');

  message = validator.validate('1');
  assert.equal(message, 'This field is not included in the list');

  message = validator.validate('5');
  assert.equal(message, 'This field is not included in the list');

  message = validator.validate(1);
  assert.equal(message, true);

  message = validator.validate(5);
  assert.equal(message, true);

  message = validator.validate(10);
  assert.equal(message, true);
});

test('range type check - string', function(assert) {
  assert.expect(5);

  options = {
    range: ['a', 'z']
  };

  set(validator, 'options', options);

  message = validator.validate(97);
  assert.equal(message, 'This field is not included in the list');

  message = validator.validate('zzz');
  assert.equal(message, 'This field is not included in the list');

  message = validator.validate('a');
  assert.equal(message, true);

  message = validator.validate('o');
  assert.equal(message, true);

  message = validator.validate('z');
  assert.equal(message, true);
});
