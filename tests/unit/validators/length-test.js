import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

let options, builtOptions, validator, message;

module('Unit | Validator | length', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    validator = this.owner.lookup('validator:length');
  });

  test('no options', function (assert) {
    assert.expect(1);

    builtOptions = validator.buildOptions({});

    message = validator.validate(undefined, builtOptions.toObject());
    assert.true(message);
  });

  test('allow blank', function (assert) {
    assert.expect(2);

    options = {
      allowBlank: true,
      min: 5,
    };

    builtOptions = validator.buildOptions(options);

    message = validator.validate('', builtOptions.toObject());
    assert.true(message);

    message = validator.validate('test', builtOptions.toObject());
    assert.strictEqual(
      message,
      'This field is too short (minimum is 5 characters)',
    );
  });

  test('allow none', function (assert) {
    assert.expect(2);

    options = {
      // default allowNone should be true
    };

    builtOptions = validator.buildOptions(options);

    message = validator.validate(undefined, builtOptions.toObject());
    assert.true(message);

    options.allowNone = false;
    builtOptions = validator.buildOptions(options);

    message = validator.validate(null, builtOptions.toObject());
    assert.strictEqual(message, 'This field is invalid');
  });

  test('is', function (assert) {
    assert.expect(2);

    options = {
      is: 4,
    };

    builtOptions = validator.buildOptions(options);

    message = validator.validate('testing', builtOptions.toObject());
    assert.strictEqual(
      message,
      'This field is the wrong length (should be 4 characters)',
    );

    message = validator.validate('test', builtOptions.toObject());
    assert.true(message);
  });

  test('min', function (assert) {
    assert.expect(2);

    options = {
      min: 5,
    };

    builtOptions = validator.buildOptions(options);

    message = validator.validate('test', builtOptions.toObject());
    assert.strictEqual(
      message,
      'This field is too short (minimum is 5 characters)',
    );

    message = validator.validate('testing', builtOptions.toObject());
    assert.true(message);
  });

  test('max', function (assert) {
    assert.expect(2);

    options = {
      max: 5,
    };

    builtOptions = validator.buildOptions(options);

    message = validator.validate('testing', builtOptions.toObject());
    assert.strictEqual(
      message,
      'This field is too long (maximum is 5 characters)',
    );

    message = validator.validate('test', builtOptions.toObject());
    assert.true(message);
  });

  test('array', function (assert) {
    assert.expect(2);

    options = {
      min: 1,
    };

    builtOptions = validator.buildOptions(options);

    message = validator.validate([], builtOptions.toObject());
    assert.strictEqual(
      message,
      'This field is too short (minimum is 1 characters)',
    );

    message = validator.validate([1], builtOptions.toObject());
    assert.true(message);
  });
});
