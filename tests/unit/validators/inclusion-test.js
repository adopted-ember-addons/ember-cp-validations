import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

let options, builtOptions, validator, message;

module('Unit | Validator | inclusion', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    validator = this.owner.lookup('validator:inclusion');
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

    message = validator.validate('test', builtOptions.toObject());
    assert.deepEqual(message, 'This field is not included in the list');
  });

  test('in array', function (assert) {
    assert.expect(4);

    options = {
      in: ['foo', 'bar', 'baz'],
    };
    builtOptions = validator.buildOptions(options);

    message = validator.validate('test', builtOptions.toObject());
    assert.deepEqual(message, 'This field is not included in the list');

    message = validator.validate('foo', builtOptions.toObject());
    assert.true(message);

    message = validator.validate('bar', builtOptions.toObject());
    assert.true(message);

    message = validator.validate('baz', builtOptions.toObject());
    assert.true(message);
  });

  test('in range', function (assert) {
    assert.expect(5);

    options = {
      range: [1, 10],
    };
    builtOptions = validator.buildOptions(options);

    message = validator.validate(0, builtOptions.toObject());
    assert.deepEqual(message, 'This field is not included in the list');

    message = validator.validate(100, builtOptions.toObject());
    assert.deepEqual(message, 'This field is not included in the list');

    message = validator.validate(1, builtOptions.toObject());
    assert.true(message);

    message = validator.validate(5, builtOptions.toObject());
    assert.true(message);

    message = validator.validate(10, builtOptions.toObject());
    assert.true(message);
  });

  test('range type check - number', function (assert) {
    assert.expect(7);

    options = {
      range: [1, 10],
    };
    builtOptions = validator.buildOptions(options);

    message = validator.validate('0', builtOptions.toObject());
    assert.deepEqual(message, 'This field is not included in the list');

    message = validator.validate(0, builtOptions.toObject());
    assert.deepEqual(message, 'This field is not included in the list');

    message = validator.validate('1', builtOptions.toObject());
    assert.deepEqual(message, 'This field is not included in the list');

    message = validator.validate('5', builtOptions.toObject());
    assert.deepEqual(message, 'This field is not included in the list');

    message = validator.validate(1, builtOptions.toObject());
    assert.true(message);

    message = validator.validate(5, builtOptions.toObject());
    assert.true(message);

    message = validator.validate(10, builtOptions.toObject());
    assert.true(message);
  });

  test('range type check - string', function (assert) {
    assert.expect(5);

    options = {
      range: ['a', 'z'],
    };
    builtOptions = validator.buildOptions(options);

    message = validator.validate(97, builtOptions.toObject());
    assert.deepEqual(message, 'This field is not included in the list');

    message = validator.validate('zzz', builtOptions.toObject());
    assert.deepEqual(message, 'This field is not included in the list');

    message = validator.validate('a', builtOptions.toObject());
    assert.true(message);

    message = validator.validate('o', builtOptions.toObject());
    assert.true(message);

    message = validator.validate('z', builtOptions.toObject());
    assert.true(message);
  });
});
