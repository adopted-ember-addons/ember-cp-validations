import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

let options, builtOptions, validator, message;

module('Unit | Validator | exclusion', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    validator = this.owner.lookup('validator:exclusion');
  });

  test('no options', function (assert) {
    assert.expect(1);

    builtOptions = validator.buildOptions({}).toObject();

    try {
      message = validator.validate(undefined, builtOptions);
    } catch (e) {
      assert.ok(true);
    }
  });

  test('allow blank', function (assert) {
    assert.expect(2);

    options = {
      allowBlank: true,
      in: ['foo', 'bar', 'baz'],
    };

    builtOptions = validator.buildOptions(options);

    message = validator.validate('', builtOptions.toObject());
    assert.true(message);

    message = validator.validate('foo', builtOptions.toObject());
    assert.strictEqual(message, 'This field is reserved');
  });

  test('not in array', function (assert) {
    assert.expect(4);

    options = {
      in: ['foo', 'bar', 'baz'],
    };

    builtOptions = validator.buildOptions(options);

    message = validator.validate('foo', builtOptions.toObject());
    assert.strictEqual(message, 'This field is reserved');

    message = validator.validate('bar', builtOptions.toObject());
    assert.strictEqual(message, 'This field is reserved');

    message = validator.validate('baz', builtOptions.toObject());
    assert.strictEqual(message, 'This field is reserved');

    message = validator.validate('test', builtOptions.toObject());
    assert.true(message);
  });

  test('not in range', function (assert) {
    assert.expect(5);

    options = {
      range: [1, 10],
    };

    builtOptions = validator.buildOptions(options);

    message = validator.validate(1, builtOptions.toObject());
    assert.strictEqual(message, 'This field is reserved');

    message = validator.validate(5, builtOptions.toObject());
    assert.strictEqual(message, 'This field is reserved');

    message = validator.validate(10, builtOptions.toObject());
    assert.strictEqual(message, 'This field is reserved');

    message = validator.validate(0, builtOptions.toObject());
    assert.true(message);

    message = validator.validate(100, builtOptions.toObject());
    assert.true(message);
  });

  test('range type check - number', function (assert) {
    assert.expect(4);

    options = {
      range: [1, 10],
    };

    builtOptions = validator.buildOptions(options);

    message = validator.validate(1, builtOptions.toObject());
    assert.strictEqual(message, 'This field is reserved');

    message = validator.validate(5, builtOptions.toObject());
    assert.strictEqual(message, 'This field is reserved');

    message = validator.validate('1', builtOptions.toObject());
    assert.true(message);

    message = validator.validate('5', builtOptions.toObject());
    assert.true(message);
  });

  test('range type check - string', function (assert) {
    assert.expect(4);

    options = {
      range: ['a', 'z'],
    };

    builtOptions = validator.buildOptions(options);

    message = validator.validate('a', builtOptions.toObject());
    assert.strictEqual(message, 'This field is reserved');

    message = validator.validate('z', builtOptions.toObject());
    assert.strictEqual(message, 'This field is reserved');

    message = validator.validate(97, builtOptions.toObject());
    assert.true(message);

    message = validator.validate('zzz', builtOptions.toObject());
    assert.true(message);
  });
});
