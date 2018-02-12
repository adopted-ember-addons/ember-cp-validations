import EmberObject from '@ember/object';
import { moduleFor, test } from 'ember-qunit';

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
    email: 'foo@gmail.com'
  });

  message = validator.validate('bar@gmail.com', builtOptions.copy(), model);
  assert.equal(message, "This field doesn't match email");

  model.set('emailConfirmation', 'foo@gmail.com');

  message = validator.validate('foo@gmail.com', builtOptions.copy(), model);
  assert.equal(message, true);
});
