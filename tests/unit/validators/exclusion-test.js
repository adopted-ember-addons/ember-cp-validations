/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import {
  moduleFor, test
}
from 'ember-qunit';

var options, builtOptions, validator, message;

moduleFor('validator:exclusion', 'Unit | Validator | exclusion', {
  needs: ['validator:messages'],
  setup: function() {
    validator = this.subject();
  }
});

test('no options', function(assert) {
  assert.expect(1);

  builtOptions = validator.buildOptions({}).copy();

  try {
    message = validator.validate(undefined, builtOptions);
  } catch (e) {
    assert.ok(true);
  }
});

test('allow blank', function(assert) {
  assert.expect(2);

  options = {
    allowBlank: true,
    "in": ["foo", "bar", "baz"]
  };

  builtOptions = validator.buildOptions(options);

  message = validator.validate('', builtOptions.copy());
  assert.equal(message, true);

  message = validator.validate('foo', builtOptions.copy());
  assert.equal(message, 'This field is reserved');
});

test('not in array', function(assert) {
  assert.expect(4);

  options = {
    "in": ["foo", "bar", "baz"]
  };

  builtOptions = validator.buildOptions(options);

  message = validator.validate('foo', builtOptions.copy());
  assert.equal(message, 'This field is reserved');

  message = validator.validate('bar', builtOptions.copy());
  assert.equal(message, 'This field is reserved');

  message = validator.validate('baz', builtOptions.copy());
  assert.equal(message, 'This field is reserved');

  message = validator.validate('test', builtOptions.copy());
  assert.equal(message, true);
});

test('not in range', function(assert) {
  assert.expect(5);

  options = {
    range: [1, 10]
  };

  builtOptions = validator.buildOptions(options);

  message = validator.validate(1, builtOptions.copy());
  assert.equal(message, "This field is reserved");

  message = validator.validate(5, builtOptions.copy());
  assert.equal(message, "This field is reserved");

  message = validator.validate(10, builtOptions.copy());
  assert.equal(message, "This field is reserved");

  message = validator.validate(0, builtOptions.copy());
  assert.equal(message, true);

  message = validator.validate(100, builtOptions.copy());
  assert.equal(message, true);
});

test('range type check - number', function(assert) {
  assert.expect(4);

  options = {
    range: [1, 10]
  };

  builtOptions = validator.buildOptions(options);

  message = validator.validate(1, builtOptions.copy());
  assert.equal(message, "This field is reserved");

  message = validator.validate(5, builtOptions.copy());
  assert.equal(message, "This field is reserved");

  message = validator.validate('1', builtOptions.copy());
  assert.equal(message, true);

  message = validator.validate('5', builtOptions.copy());
  assert.equal(message, true);
});

test('range type check - string', function(assert) {
  assert.expect(4);

  options = {
    range: ['a', 'z']
  };

  builtOptions = validator.buildOptions(options);

  message = validator.validate('a', builtOptions.copy());
  assert.equal(message, "This field is reserved");

  message = validator.validate('z', builtOptions.copy());
  assert.equal(message, "This field is reserved");

  message = validator.validate(97, builtOptions.copy());
  assert.equal(message, true);

  message = validator.validate('zzz', builtOptions.copy());
  assert.equal(message, true);
});
