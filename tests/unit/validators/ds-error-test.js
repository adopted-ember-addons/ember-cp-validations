/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import DS from 'ember-data';
import {
  moduleFor, test
}
from 'ember-qunit';

var model, validator, message;

moduleFor('validator:ds-error', 'Unit | Validator | ds-error', {
  needs: ['validator:messages'],
  setup: function() {
    validator = this.subject();
  }
});

test('works with empty object', function(assert) {
  assert.expect(1);

  model = Ember.Object.create();

  message = validator.validate(undefined, undefined, model, 'username');
  assert.equal(message, true);
});

test('it works', function(assert) {
  assert.expect(2);

  model = Ember.Object.create({
    errors: DS.Errors.create(),
    username: null
  });

  message = validator.validate(undefined, undefined, model, 'username');
  assert.equal(message, true);

  model.get('errors').add('username', 'Username is not unique');

  message = validator.validate(undefined, undefined, model, 'username');
  assert.equal(message, 'Username is not unique');
});

test('gets last message', function(assert) {
  assert.expect(2);

  model = Ember.Object.create({
    errors: DS.Errors.create(),
    username: null
  });

  message = validator.validate(undefined, undefined, model, 'username');
  assert.equal(message, true);

  model.get('errors').add('username', 'Username is not unique');
  model.get('errors').add('username', 'Username is too long');

  message = validator.validate(undefined, undefined, model, 'username');
  assert.equal(message, 'Username is too long');
});
