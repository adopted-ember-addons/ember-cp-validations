import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Validator from 'ember-cp-validations/validators/presence';
import { setOwner } from '@ember/application';

let options, builtOptions, validator, message;

module('Unit | Validator | presence', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    validator = new Validator();
    setOwner(validator, this.owner);
  });

  test('buildOptions', function (assert) {
    assert.expect(2);

    options = true;
    builtOptions = validator.buildOptions(options, {});
    assert.true(builtOptions.presence);

    options = { presence: true };
    builtOptions = validator.buildOptions(options, {});
    assert.true(builtOptions.presence);
  });

  test('presence - value present', function (assert) {
    assert.expect(1);

    options = { presence: true };

    builtOptions = validator.buildOptions(options);

    message = validator.validate('value', builtOptions.toObject());
    assert.true(message);
  });

  test('presence - value blank', function (assert) {
    assert.expect(1);

    options = { presence: true };

    builtOptions = validator.buildOptions(options);

    message = validator.validate(' ', builtOptions.toObject());
    assert.true(message);
  });

  test('presence with ignoreBlank - value blank', function (assert) {
    assert.expect(1);

    options = { presence: true, ignoreBlank: true };

    builtOptions = validator.buildOptions(options);

    message = validator.validate(' ', builtOptions.toObject());
    assert.deepEqual(message, "This field can't be blank");
  });

  test('presence - value not present', function (assert) {
    assert.expect(1);

    options = { presence: true };
    builtOptions = validator.buildOptions(options);

    message = validator.validate(undefined, builtOptions.toObject());
    assert.deepEqual(message, "This field can't be blank");
  });

  test('absence - value present', function (assert) {
    assert.expect(1);

    options = { presence: false };
    builtOptions = validator.buildOptions(options);

    message = validator.validate('value', builtOptions.toObject());
    assert.deepEqual(message, 'This field must be blank');
  });

  test('absence - value not present', function (assert) {
    assert.expect(1);

    options = { presence: false };
    builtOptions = validator.buildOptions(options);

    message = validator.validate(undefined, builtOptions.toObject());
    assert.true(message);
  });
});
