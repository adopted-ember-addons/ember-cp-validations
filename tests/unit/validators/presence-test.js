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

moduleFor('validator:presence', 'Unit | Validator | presence', {
  needs: ['validator:messages'],
  setup: function() {
    validator = this.subject();
  }
});

test('buildOptions', function(assert) {
  assert.expect(2);

  let builtOptions = validator.buildOptions(true, {});
  assert.equal(builtOptions.get('presence'), true);

  builtOptions = validator.buildOptions({ presence: true }, {});
  assert.equal(builtOptions.get('presence'), true);
});

test('presence - value present', function(assert) {
  assert.expect(1);

  options = { presence: true };
  message = validator.validate('value', options);
  assert.equal(message, true);
});

test('presence - value blank', function(assert) {
  assert.expect(1);

  options = { presence: true };
  message = validator.validate(' ', options);
  assert.equal(message, true);
});

test('presence with ignoreBlank - value blank', function(assert) {
  assert.expect(1);

  options = { presence: true, ignoreBlank: true };
  message = validator.validate(' ', options);
  assert.equal(message, "This field can't be blank");
});

test('presence - value not present', function(assert) {
  assert.expect(1);

  options = { presence: true };
  message = validator.validate(undefined, options);
  assert.equal(message, "This field can't be blank");
});

test('absence - value present', function(assert) {
  assert.expect(1);

  options = { presence: false };
  message = validator.validate('value', options);
  assert.equal(message, "This field must be blank");
});

test('absence - value not present', function(assert) {
  assert.expect(1);

  options = { presence: false };

  message = validator.validate(undefined, options);
  assert.equal(message, true);
});
