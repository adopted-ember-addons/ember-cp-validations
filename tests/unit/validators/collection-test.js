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

test('collection - value is collection', function(assert) {
  assert.expect(1);

  set(validator, 'options', true);
  validator.init();
  message = validator.validate(['foo', 'bar']);
  assert.equal(message, true);
});

test('collection - value not collection', function(assert) {
  assert.expect(1);

  set(validator, 'options', true);
  validator.init();
  message = validator.validate('foo');
  assert.equal(message, "This field must be a collection");
});


test('singular - value is singular', function(assert) {
  assert.expect(1);

  set(validator, 'options', false);
  validator.init();
  message = validator.validate('value');
  assert.equal(message, true);
});

test('singular - value not singular', function(assert) {
  assert.expect(1);

  set(validator, 'options', false);
  validator.init();
  message = validator.validate(['foo', 'bar']);
  assert.equal(message, "This field can't be a collection");
});
