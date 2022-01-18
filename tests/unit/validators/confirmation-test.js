import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Validator from 'ember-cp-validations/validators/confirmation';
import { setOwner } from '@ember/application';

let model, options, builtOptions, validator, message;

module('Unit | Validator | confirmation', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    validator = new Validator();
    setOwner(validator, this.owner);
  });

  test('attribute', function (assert) {
    assert.expect(2);

    options = { on: 'email' };
    builtOptions = validator.buildOptions(options);

    model = {
      email: 'foo@gmail.com',
    };

    message = validator.validate(
      'bar@gmail.com',
      builtOptions.toObject(),
      model
    );
    assert.deepEqual(message, "This field doesn't match email");

    model.emailConfirmation = 'foo@gmail.com';

    message = validator.validate(
      'foo@gmail.com',
      builtOptions.toObject(),
      model
    );
    assert.true(message);
  });
});
