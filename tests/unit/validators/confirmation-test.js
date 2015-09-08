/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import {
  moduleFor, test
}
from 'ember-qunit';

var model, options, validator, message;
var set = Ember.set;

moduleFor('validator:confirmation', 'Unit | Validator | confirmation', {
  integration: true,
  setup: function() {
    validator = this.subject();
  }
});

test('attribute', function(assert) {
  assert.expect(2);

  model = Ember.Object.create({
    'email': 'foo@yahoo.com'
  });

  set(validator, 'attribute', 'email');
  set(validator, 'model', model);

  message = validator.validate('bar@yahoo.com');
  assert.equal(message, "This field doesn't match email");

  validator.set('model.emailConfirmation', 'foo@yahoo.com');

  message = validator.validate('foo@yahoo.com');
  assert.equal(message, true);
});
