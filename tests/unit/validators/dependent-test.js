import { validator } from 'ember-cp-validations';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import setupObject from '../../helpers/setup-object';

let Validator, message, model, options, builtOptions;

let Validations = {
  firstName: validator('presence', true),
  lastName: validator('presence', true),
};

let defaultOptions = {
  on: ['firstName', 'lastName'],
};

module('Unit | Validator | dependent', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    Validator = this.owner.lookup('validator:dependent');
  });

  test('no options', function (assert) {
    assert.expect(1);

    builtOptions = Validator.buildOptions({}).toObject();

    try {
      message = Validator.validate(undefined, builtOptions);
    } catch (e) {
      assert.ok(true);
    }
  });

  test('all empty attributes', function (assert) {
    assert.expect(4);

    options = defaultOptions;
    builtOptions = Validator.buildOptions(options);

    model = setupObject(this, Validations);

    assert.false(model.validations.isValid);

    message = Validator.validate(undefined, builtOptions.toObject(), model);

    assert.deepEqual(message, 'This field is invalid');
    assert.deepEqual(model.validations.messages.length, 1);
    assert.false(model.validations.isValid);
  });

  test('one dependent error', function (assert) {
    assert.expect(4);

    options = defaultOptions;
    builtOptions = Validator.buildOptions(options);

    model = setupObject(this, Validations, {
      firstName: 'Offir',
    });

    assert.false(model.validations.isValid);

    message = Validator.validate(undefined, builtOptions.toObject(), model);

    assert.deepEqual(message, 'This field is invalid');
    assert.deepEqual(model.validations.messages.length, 1);
    assert.false(model.validations.isValid);
  });

  test('no dependent errors', function (assert) {
    assert.expect(4);
    options = defaultOptions;
    builtOptions = Validator.buildOptions(options);

    model = setupObject(this, Validations, {
      firstName: 'Offir',
      lastName: 'Golan',
    });

    assert.true(model.validations.isValid);

    message = Validator.validate(undefined, builtOptions.toObject(), model);

    assert.true(message);
    assert.deepEqual(model.validations.messages.length, 0);
    assert.true(model.validations.isValid);
  });
});
