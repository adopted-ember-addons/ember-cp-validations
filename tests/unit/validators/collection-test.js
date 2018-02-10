/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import { moduleFor, test } from 'ember-qunit';

let options, builtOptions, validator, message;

moduleFor('validator:collection', 'Unit | Validator | collection', {
  needs: ['validator:messages'],
  setup() {
    validator = this.subject();
  }
});

test('buildOptions', function(assert) {
  assert.expect(2);

  options = true;
  builtOptions = validator.buildOptions(options, {});

  assert.equal(builtOptions.get('collection'), true);

  options = { collection: true };
  builtOptions = validator.buildOptions(options, {});
  assert.equal(builtOptions.get('collection'), true);
});

test('value is collection', function(assert) {
  assert.expect(1);

  options = { collection: true };
  builtOptions = validator.buildOptions(options);

  message = validator.validate(['foo', 'bar'], builtOptions.copy());
  assert.equal(message, true);
});

test('value not collection', function(assert) {
  assert.expect(1);

  options = { collection: true };
  builtOptions = validator.buildOptions(options);

  message = validator.validate('foo', builtOptions.copy());
  assert.equal(message, 'This field must be a collection');
});

test('singular - value is singular', function(assert) {
  assert.expect(1);

  options = { collection: false };
  builtOptions = validator.buildOptions(options);

  message = validator.validate('value', builtOptions.copy());
  assert.equal(message, true);
});

test('singular - value not singular', function(assert) {
  assert.expect(1);

  options = { collection: false };
  builtOptions = validator.buildOptions(options);

  message = validator.validate(['foo', 'bar'], builtOptions.copy());
  assert.equal(message, "This field can't be a collection");
});
