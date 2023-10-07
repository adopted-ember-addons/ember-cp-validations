import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

let model, options, builtOptions, validator, message;

module('Unit | Validator | confirmation', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    validator = this.owner.lookup('validator:confirmation');
  });

  test('attribute', function (assert) {
    assert.expect(2);

    options = { on: 'email' };
    builtOptions = validator.buildOptions(options);

    model = EmberObject.create({
      email: 'foo@gmail.com',
    });

    message = validator.validate(
      'bar@gmail.com',
      builtOptions.toObject(),
      model,
    );
    assert.strictEqual(message, "This field doesn't match email");

    model.set('emailConfirmation', 'foo@gmail.com');

    message = validator.validate(
      'foo@gmail.com',
      builtOptions.toObject(),
      model,
    );
    assert.true(message);
  });
});
