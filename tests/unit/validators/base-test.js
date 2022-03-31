import { htmlSafe } from '@ember/template';
import EmberObject from '@ember/object';
import { alias } from '@ember/object/computed';
import BaseValidator from 'ember-cp-validations/validators/base';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import setupObject from '../../helpers/setup-object';

let defaultOptions, options, validator, message;

module('Unit | Validator | base', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    validator = setupObject(this, BaseValidator);
  });

  test('buildOptions - merge all options', function(assert) {
    assert.expect(1);

    options = {
      foo: 'a'
    };

    defaultOptions = {
      bar: 'b'
    };

    options = validator.buildOptions(options, defaultOptions);
    assert.deepEqual(options.getProperties(['foo', 'bar']), {
      foo: 'a',
      bar: 'b'
    });
  });

  test('buildOptions - does not overwrite options', function(assert) {
    assert.expect(1);

    options = {
      foo: 'a',
      bar: 'b'
    };

    defaultOptions = {
      bar: 'c'
    };

    options = validator.buildOptions(options, defaultOptions);
    assert.deepEqual(options.getProperties(['foo', 'bar']), {
      foo: 'a',
      bar: 'b'
    });
  });

  test('buildOptions - toObject', function(assert) {
    assert.expect(4);

    options = validator.buildOptions({
      foo: alias('bar'),
      bar: 'bar'
    });

    assert.ok(options instanceof EmberObject);

    let optionsObj = options.toObject();

    assert.equal(typeof optionsObj, 'object');
    assert.notOk(optionsObj instanceof EmberObject);
    assert.equal(optionsObj.foo, 'bar');
  });

  test('createErrorMessage - message function', function(assert) {
    assert.expect(1);

    options = {
      message() {
        return '{description} has some sort of error';
      }
    };

    message = validator.createErrorMessage(undefined, undefined, options);
    assert.equal(message, 'This field has some sort of error');
  });

  test('value - default gets model value', function(assert) {
    assert.expect(2);

    validator.setProperties({
      model: EmberObject.create({ foo: 'bar' }),
      attribute: 'foo',
      options: {}
    });

    validator.init();

    assert.equal(validator.get('attribute'), 'foo');
    assert.equal(validator.getValue(), 'bar');
  });

  test('value - overwrite value method via options', function(assert) {
    assert.expect(3);

    validator.setProperties({
      model: EmberObject.create({ foo: 'bar', bar: 'baz' }),
      attribute: 'foo',
      options: {
        value() {
          return this.get('model.bar');
        }
      }
    });

    validator.init();

    assert.equal(validator.get('attribute'), 'foo');
    assert.equal(validator.getValue(), 'baz');
    assert.notOk(validator.get('options.value'));
  });

  test('message - handles SafeString', function(assert) {
    assert.expect(1);

    options = {
      message: htmlSafe('should be more than &euro;15')
    };

    message = validator.createErrorMessage(undefined, undefined, options);
    assert.equal(message, 'should be more than &euro;15');
  });
});
