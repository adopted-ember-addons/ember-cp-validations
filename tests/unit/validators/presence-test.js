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

moduleFor('validator:presence', 'Unit | Validator | presence', {
  integration: true,
  setup: function() {
    validator = this.subject();
  }
});

test('presence - value present', function(assert) {
  assert.expect(1);

  set(validator, 'options', true);
  validator.init();
  message = validator.validate('value');
  assert.equal(message, true);
});

test('presence - value not present', function(assert) {
  assert.expect(1);

  set(validator, 'options', true);
  validator.init();
  message = validator.validate();
  assert.equal(message, "This field can't be blank");
});


test('absence - value present', function(assert) {
  assert.expect(1);

  set(validator, 'options', false);
  validator.init();
  message = validator.validate('value');
  assert.equal(message, "This field must be blank");
});

test('absence - value not present', function(assert) {
  assert.expect(1);

  set(validator, 'options', false);
  validator.init();
  message = validator.validate();
  assert.equal(message, true);
});
