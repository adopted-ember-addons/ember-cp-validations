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

moduleFor('validator:inline', 'Unit | Validator | inline', {
  needs: ['validator:messages'],
  setup: function() {
    validator = this.subject();
  }
});

test('buildOptions', function(assert) {
  assert.expect(2);

  let func = function(value, options) {
    return true;
  };

  options = func;
  let builtOptions = validator.buildOptions(options, {});
  assert.deepEqual(builtOptions, { validate: func });

  options = { validate: func };
  builtOptions = validator.buildOptions(options, {});
  assert.deepEqual(builtOptions, { validate: func });
});

test('inline - returning true is valid', function(assert) {
  assert.expect(1);

  options = { validate: function() { return true; } };
  message = validator.validate('value', options);
  assert.equal(message, true);
});

test('inline - retuning false uses default message', function(assert) {
  assert.expect(1);

  options = { validate: function() { return false; } };
  message = validator.validate('value', options);
  assert.equal(message, "This field is not valid");
});

test('inline - returning string uses returned message', function(assert) {
  assert.expect(1);

  options = { validate: function() { return "You didn't say the magic word"; } };
  message = validator.validate('value', options);
  assert.equal(message, "You didn't say the magic word");
});

test('inline - returning string formats returned message', function(assert) {
  assert.expect(1);

  options = { validate: function() { return "{description} didn't say the magic word"; } };
  message = validator.validate('value', options);
  assert.equal(message, "This field didn't say the magic word");
});

test('inline - returning false uses option message', function(assert) {
  assert.expect(1);

  options = {
    validate: function() { return false; },
    message: "{description} didn't say the magic word"
  };
  message = validator.validate('value', options);
  assert.equal(message, "This field didn't say the magic word");
});

test('inline - validates based on variable value', function(assert) {
  assert.expect(4);

  options = {
    validate: function(value) { return value % 2 === 0; }
  };
  message = validator.validate(1, options);
  assert.equal(message, "This field is not valid");

  message = validator.validate(2, options);
  assert.equal(message, true);

  message = validator.validate(3, options);
  assert.equal(message, "This field is not valid");

  message = validator.validate(4, options);
  assert.equal(message, true);
});