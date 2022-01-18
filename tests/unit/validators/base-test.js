import { htmlSafe } from '@ember/template';
import Validator from 'ember-cp-validations/validators/base';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { setOwner } from '@ember/application';

let defaultOptions, options, validator, message;

module('Unit | Validator | base', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    validator = new Validator();
    setOwner(validator, this.owner);
  });

  test('buildOptions - merge all options', function (assert) {
    assert.expect(2);

    options = {
      foo: 'a',
    };

    defaultOptions = {
      bar: 'b',
    };

    options = validator.buildOptions(options, defaultOptions);
    assert.strictEqual(options.foo, 'a');
    assert.strictEqual(options.bar, 'b');
  });

  test('buildOptions - does not overwrite options', function (assert) {
    assert.expect(2);

    options = {
      foo: 'a',
      bar: 'b',
    };

    defaultOptions = {
      bar: 'c',
    };

    options = validator.buildOptions(options, defaultOptions);
    assert.strictEqual(options.foo, 'a');
    assert.strictEqual(options.bar, 'b');
  });

  test('buildOptions - toObject', function (assert) {
    assert.expect(2);

    options = validator.buildOptions({
      get foo() {
        return this.bar;
      },
      bar: 'bar',
    });

    let optionsObj = options.toObject();

    assert.deepEqual(typeof optionsObj, 'object');
    assert.deepEqual(optionsObj.foo, 'bar');
  });

  test('createErrorMessage - message function', function (assert) {
    assert.expect(1);

    options = {
      message() {
        return '{description} has some sort of error';
      },
    };

    message = validator.createErrorMessage(undefined, undefined, options);
    assert.deepEqual(message, 'This field has some sort of error');
  });

  test('value - default gets model value', function (assert) {
    assert.expect(2);

    Object.assign(validator, {
      model: { foo: 'bar' },
      attribute: 'foo',
      options: {},
    });

    assert.deepEqual(validator.attribute, 'foo');
    assert.deepEqual(validator.getValue(), 'bar');
  });

  test('value - overwrite value method via options', function (assert) {
    assert.expect(3);

    Object.assign(validator, {
      model: { foo: 'bar', bar: 'baz' },
      attribute: 'foo',
    });

    validator.options = validator.buildOptions({
      value() {
        return this.model.bar;
      },
    });

    assert.deepEqual(validator.attribute, 'foo');
    assert.deepEqual(validator.getValue(), 'baz');
    assert.notOk(validator.options.value);
  });

  test('message - handles SafeString', function (assert) {
    assert.expect(1);

    options = {
      message: htmlSafe('should be more than &euro;15'),
    };

    message = validator.createErrorMessage(undefined, undefined, options);
    assert.deepEqual(message, 'should be more than &euro;15');
  });
});
