import EmberObject, { get } from '@ember/object';
import { validator, buildValidations } from 'ember-cp-validations';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import setupObject from '../../helpers/setup-object';

let Validator, message, model, options, builtOptions;

let Validations = buildValidations({
  firstName: validator('presence', true),
  lastName: validator('presence', true)
});

let defaultOptions = {
  on: ['firstName', 'lastName']
};

module('Unit | Validator | dependent', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    Validator = this.owner.lookup('validator:dependent');
  });

  test('no options', function(assert) {
    assert.expect(1);

    builtOptions = Validator.buildOptions({}).toObject();

    try {
      message = Validator.validate(undefined, builtOptions);
    } catch (e) {
      assert.ok(true);
    }
  });

  test('all empty attributes', function(assert) {
    assert.expect(5);

    options = defaultOptions;
    builtOptions = Validator.buildOptions(options);

    model = setupObject(this, EmberObject.extend(Validations));

    assert.equal(get(model, 'validations.isValid'), false);
    assert.equal(get(model, 'validations.isDirty'), false);

    message = Validator.validate(undefined, builtOptions.toObject(), model);

    assert.equal(message, 'This field is invalid');
    assert.equal(get(model, 'validations.messages.length'), 1);
    assert.equal(get(model, 'validations.isValid'), false);
  });

  test('one dependent error', function(assert) {
    assert.expect(5);

    options = defaultOptions;
    builtOptions = Validator.buildOptions(options);

    model = setupObject(this, EmberObject.extend(Validations), {
      firstName: 'Offir'
    });

    assert.equal(get(model, 'validations.isValid'), false);
    assert.equal(get(model, 'validations.isDirty'), true);

    message = Validator.validate(undefined, builtOptions.toObject(), model);

    assert.equal(message, 'This field is invalid');
    assert.equal(get(model, 'validations.messages.length'), 1);
    assert.equal(get(model, 'validations.isValid'), false);
  });

  test('no dependent errors', function(assert) {
    assert.expect(5);
    options = defaultOptions;
    builtOptions = Validator.buildOptions(options);

    model = setupObject(this, EmberObject.extend(Validations), {
      firstName: 'Offir',
      lastName: 'Golan'
    });

    assert.equal(get(model, 'validations.isValid'), true);
    assert.equal(get(model, 'validations.isDirty'), true);

    message = Validator.validate(undefined, builtOptions.toObject(), model);

    assert.equal(message, true);
    assert.equal(get(model, 'validations.messages.length'), 0);
    assert.equal(get(model, 'validations.isValid'), true);
  });
});
