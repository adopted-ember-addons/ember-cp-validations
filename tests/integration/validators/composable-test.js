import DefaultMessages from 'dummy/validators/messages';
import LengthValidator from 'ember-cp-validations/validators/length';
import PresenceValidator from 'ember-cp-validations/validators/presence';
import BaseValidator from 'ember-cp-validations/validators/base';
import setupObject from '../../helpers/setup-object';
import { validator } from 'ember-cp-validations';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

const ComposedValidations = {
  value: validator('composed'),
};

module('Integration | Validators | Composable', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('validator:messages', DefaultMessages);
  });

  test('Composability - simple', function (assert) {
    assert.expect(5);

    this.owner.register('validator:presence', PresenceValidator);
    this.owner.register(
      'validator:composed',
      class ComposedValidator extends BaseValidator {
        validate(value) {
          return this.test('presence', value, { presence: true });
        }
      }
    );

    const obj = setupObject(this, ComposedValidations, {
      value: '',
    });

    assert.false(obj.validations.isValid);
    assert.deepEqual(obj.validations.message, "This field can't be blank");

    obj.set('value', 'foo');

    assert.true(obj.validations.isValid);
  });

  test('Composability - multiple', function (assert) {
    assert.expect(8);

    this.owner.register('validator:presence', PresenceValidator);
    this.owner.register('validator:length', LengthValidator);
    this.owner.register(
      'validator:composed',
      BaseValidator.extend({
        validate(value) {
          let result = this.test('presence', value, { presence: true });

          if (!result.isValid) {
            return result.message;
          }

          result = this.test('length', value, { max: 5 });

          if (!result.isValid) {
            return result.message;
          }

          return true;
        },
      })
    );

    const obj = setupObject(this, ComposedValidations, {
      value: '',
    });

    assert.false(obj.validations.isValid);
    assert.deepEqual(obj.validations.message, "This field can't be blank");

    obj.set('value', 'foobar');

    assert.false(obj.validations.isValid);
    assert.deepEqual(
      obj.validations.message,
      'This field is too long (maximum is 5 characters)'
    );

    obj.set('value', 'foo');

    assert.true(obj.validations.isValid);
  });

  test('Composability - unsupported types', function (assert) {
    const unsupportedTypes = ['alias', 'belongs-to', 'dependent', 'has-many'];

    assert.expect(unsupportedTypes.length);

    unsupportedTypes.forEach((type) =>
      this.owner.register(`validator:${type}`, BaseValidator)
    );

    this.owner.register(
      'validator:composed',
      BaseValidator.extend({
        validate(type) {
          this.test(type);
        },
      })
    );

    const obj = setupObject(this, ComposedValidations, {
      value: '',
    });

    unsupportedTypes.forEach((type) => {
      obj.set('value', type);
      assert.throws(() => obj.validate(), new RegExp(type));
    });
  });

  test('Validators get cached', function (assert) {
    assert.expect(3);

    this.owner.register('validator:presence', PresenceValidator);
    this.owner.register(
      'validator:composed',
      BaseValidator.extend({
        validate(value) {
          const cache = this._testValidatorCache;

          assert.notOk(cache.presence);

          this.test('presence', value, { presence: true });

          const presenceValidator = cache.presence;
          assert.ok(cache.presence);

          this.test('presence', value, { presence: false });

          assert.deepEqual(presenceValidator, cache.presence);
        },
      })
    );

    const obj = setupObject(this, ComposedValidations, {
      value: '',
    });

    obj.validate();
  });
});
