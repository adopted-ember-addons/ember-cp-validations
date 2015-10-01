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

moduleFor('validator:collection', 'Unit | Validator | collection', {
  needs: ['validator:messages'],
  setup: function() {
    validator = this.subject();
  }
});

test('buildOptions', function(assert) {
  assert.expect(2);

  options = true;
  let builtOptions = validator.buildOptions(options, {});
  assert.deepEqual(builtOptions, { collection: true });

  options = { collection: true };
  builtOptions = validator.buildOptions(options, {});
  assert.deepEqual(builtOptions, { collection: true });
});

test('value is collection', function(assert) {
  assert.expect(1);

  options = { collection: true };
  message = validator.validate(['foo', 'bar'], options);
  assert.equal(message, true);
});

test('value not collection', function(assert) {
  assert.expect(1);

  options = { collection: true };
  message = validator.validate('foo', options);
  assert.equal(message, "This field must be a collection");
});

test('singular - value is singular', function(assert) {
  assert.expect(1);

  options = { collection: false };
  message = validator.validate('value', options);
  assert.equal(message, true);
});

test('singular - value not singular', function(assert) {
  assert.expect(1);

  options = { collection: false };
  message = validator.validate(['foo', 'bar'], options);
  assert.equal(message, "This field can't be a collection");
});
