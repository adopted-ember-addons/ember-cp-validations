/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import {
  validator, buildValidations
}
from 'ember-cp-validations';
import {
  test, moduleFor
}
from 'ember-qunit';
const {
  get,
  set,
  run
} = Ember;

var Validator, message, object;

var Validations = buildValidations({
  firstName: validator('presence', true),
  lastName: validator('presence', true)
});

var defaultOptions = {
  on: ['firstName', 'lastName']
};

moduleFor('validator:dependent', 'Unit | Validator | dependent', {
  integration: true,
  setup: function() {
    Validator = this.subject();
  }
});

test('no options', function(assert) {
  assert.expect(1);
  message = Validator.validate();
  assert.equal(message, true);
});

test('all empty attributes', function(assert) {
  assert.expect(5);
  object = Ember.Object.extend(Validations).create({
    container: get(this, 'container')
  });

  Validator.setProperties({
    model: object,
    options: defaultOptions
  });

  assert.equal(get(object, 'validations.isValid'), false);
  assert.equal(get(object, 'validations.isDirty'), false);

  message = Validator.validate();

  assert.equal(message, "This field is invalid");
  assert.equal(get(object, 'validations.messages.length'), 2);
  assert.equal(get(object, 'validations.isValid'), false);
});

test('one dependent error', function(assert) {
  assert.expect(5);
  object = Ember.Object.extend(Validations).create({
    firstName: 'Offir',
    container: get(this, 'container')
  });

  Validator.setProperties({
    model: object,
    options: defaultOptions
  });

  assert.equal(get(object, 'validations.isValid'), false);
  assert.equal(get(object, 'validations.isDirty'), true);

  message = Validator.validate();

  assert.equal(message, "This field is invalid");
  assert.equal(get(object, 'validations.messages.length'), 1);
  assert.equal(get(object, 'validations.isValid'), false);
});

test('no dependent errors', function(assert) {
  assert.expect(5);
  object = Ember.Object.extend(Validations).create({
    firstName: 'Offir',
    lastName: 'Golan',
    container: get(this, 'container')
  });

  Validator.setProperties({
    model: object,
    options: defaultOptions
  });

  assert.equal(get(object, 'validations.isValid'), true);
  assert.equal(get(object, 'validations.isDirty'), true);

  message = Validator.validate();

  assert.equal(message, true);
  assert.equal(get(object, 'validations.messages.length'), 0);
  assert.equal(get(object, 'validations.isValid'), true);
});
