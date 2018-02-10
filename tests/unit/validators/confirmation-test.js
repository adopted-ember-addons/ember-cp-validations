/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import EmberObject from '@ember/object';
import {
  moduleFor, test
}
from 'ember-qunit';

let model, options, builtOptions, validator, message;

moduleFor('validator:confirmation', 'Unit | Validator | confirmation', {
  needs: ['validator:messages'],
  setup() {
    validator = this.subject();
  }
});

test('attribute', function(assert) {
  assert.expect(2);

  options = { on: 'email' };
  builtOptions = validator.buildOptions(options);

  model = EmberObject.create({
    'email': 'foo@yahoo.com'
  });

  message = validator.validate('bar@yahoo.com', builtOptions.copy(), model);
  assert.equal(message, 'This field doesn\'t match email');

  model.set('emailConfirmation', 'foo@yahoo.com');

  message = validator.validate('foo@yahoo.com', builtOptions.copy(), model);
  assert.equal(message, true);
});
