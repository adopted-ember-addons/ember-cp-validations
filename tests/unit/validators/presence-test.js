/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

let validator;

moduleFor('validator:presence', 'Unit | Validator | presence', {
  needs: ['validator:messages'],
  setup: function() {
    validator = this.subject();
  }
});

test('buildOptions', function(assert) {
  assert.expect(2);

  let options = true;
  let builtOptions = validator.buildOptions(options, {});
  assert.deepEqual(builtOptions, { presence: true });

  options = { presence: true };
  builtOptions = validator.buildOptions(options, {});
  assert.deepEqual(builtOptions, { presence: true });
});

test('presence - value present', function(assert) {
  assert.expect(1);

  const options = { presence: true };
  const message = validator.validate('value', options);
  assert.equal(message, true);
});

test('presence - value not present', function(assert) {
  assert.expect(1);

  const options = { presence: true };
  const message = validator.validate(undefined, options);
  assert.equal(message, "This field can't be blank");
});


test('absence - value present', function(assert) {
  assert.expect(1);

  const options = { presence: false };
  const message = validator.validate('value', options);
  assert.equal(message, "This field must be blank");
});

test('absence - value not present', function(assert) {
  assert.expect(1);

  const options = { presence: false };
  const message = validator.validate(undefined, options);
  assert.equal(message, true);
});
