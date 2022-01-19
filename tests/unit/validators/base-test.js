import { htmlSafe } from '@ember/template';
import BaseValidator from 'ember-cp-validations/validators/base';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

let defaultOptions, options, validator, message;

module('Unit | Validator | base', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    validator = new BaseValidator();
  });

  test('buildOptions - merge all options', function (assert) {
    assert.expect(1);

    options = {
      foo: 'a',
    };

    defaultOptions = {
      bar: 'b',
    };

    options = validator.buildOptions(options, defaultOptions);
    assert.deepEqual(
      { foo: options.foo, bar: options.bar },
      {
        foo: 'a',
        bar: 'b',
      }
    );
  });

  test('buildOptions - does not overwrite options', function (assert) {
    assert.expect(1);

    options = {
      foo: 'a',
      bar: 'b',
    };

    defaultOptions = {
      bar: 'c',
    };

    options = validator.buildOptions(options, defaultOptions);
    assert.deepEqual(
      { foo: options.foo, bar: options.bar },
      {
        foo: 'a',
        bar: 'b',
      }
    );
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

    validator = new BaseValidator({
      model: { foo: 'bar' },
      attribute: 'foo',
      options: {},
    });

    assert.deepEqual(validator.attribute, 'foo');
    assert.deepEqual(validator.getValue(), 'bar');
  });

  test('value - overwrite value method via options', function (assert) {
    assert.expect(3);

    validator = new BaseValidator({
      model: { foo: 'bar', bar: 'baz' },
      attribute: 'foo',
      options: {
        value() {
          return this.model.bar;
        },
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
