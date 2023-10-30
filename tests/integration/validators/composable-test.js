import DefaultMessages from 'dummy/validators/messages';
import LengthValidator from 'ember-cp-validations/validators/length';
import PresenceValidator from 'ember-cp-validations/validators/presence';
import BaseValidator from 'ember-cp-validations/validators/base';
import EmberObject from '@ember/object';
import setupObject from '../../helpers/setup-object';
import { validator, buildValidations } from 'ember-cp-validations';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { Promise } from 'rsvp';

const ComposedValidations = buildValidations({
  value: validator('composed'),
});

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
      BaseValidator.extend({
        validate(value) {
          return this.test('presence', value, { presence: true });
        },
      }),
    );

    const obj = setupObject(this, EmberObject.extend(ComposedValidations), {
      value: '',
    });

    assert.false(obj.get('validations.isValid'));
    assert.false(obj.get('validations.isValidating'));
    assert.strictEqual(
      obj.get('validations.message'),
      "This field can't be blank",
    );

    obj.set('value', 'foo');

    assert.true(obj.get('validations.isValid'));
    assert.false(obj.get('validations.isValidating'));
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
      }),
    );

    const obj = setupObject(this, EmberObject.extend(ComposedValidations), {
      value: '',
    });

    assert.false(obj.get('validations.isValid'));
    assert.false(obj.get('validations.isValidating'));
    assert.strictEqual(
      obj.get('validations.message'),
      "This field can't be blank",
    );

    obj.set('value', 'foobar');

    assert.false(obj.get('validations.isValid'));
    assert.false(obj.get('validations.isValidating'));
    assert.strictEqual(
      obj.get('validations.message'),
      'This field is too long (maximum is 5 characters)',
    );

    obj.set('value', 'foo');

    assert.true(obj.get('validations.isValid'));
    assert.false(obj.get('validations.isValidating'));
  });

  test('Composability - async', async function (assert) {
    assert.expect(8);

    this.owner.register(
      'validator:async-resolve',
      BaseValidator.extend({
        validate(value) {
          return Promise.resolve(
            value.includes('foo') ? true : 'Must include foo!',
          );
        },
      }),
    );

    this.owner.register(
      'validator:async-reject',
      BaseValidator.extend({
        validate(value) {
          return Promise.reject(
            value.includes('bar') ? true : 'Must include bar!',
          );
        },
      }),
    );

    this.owner.register(
      'validator:composed',
      BaseValidator.extend({
        async validate(value) {
          let result = await this.test('async-resolve', value);

          if (!result.isValid) {
            return result.message;
          }

          result = await this.test('async-reject', value);

          if (!result.isValid) {
            return result.message;
          }

          return true;
        },
      }),
    );

    const obj = setupObject(this, EmberObject.extend(ComposedValidations), {
      value: '',
    });

    await obj.validate();

    assert.false(obj.get('validations.isValid'));
    assert.false(obj.get('validations.isValidating'));
    assert.strictEqual(obj.get('validations.message'), 'Must include foo!');

    obj.set('value', 'foo');
    await obj.validate();

    assert.false(obj.get('validations.isValid'));
    assert.false(obj.get('validations.isValidating'));
    assert.strictEqual(obj.get('validations.message'), 'Must include bar!');

    obj.set('value', 'foobar');
    await obj.validate();

    assert.true(obj.get('validations.isValid'));
    assert.false(obj.get('validations.isValidating'));
  });

  test('Composability - unsupported types', function (assert) {
    const unsupportedTypes = ['alias', 'belongs-to', 'dependent', 'has-many'];

    assert.expect(unsupportedTypes.length);

    unsupportedTypes.forEach((type) =>
      this.owner.register(`validator:${type}`, BaseValidator),
    );

    this.owner.register(
      'validator:composed',
      BaseValidator.extend({
        validate(type) {
          this.test(type);
        },
      }),
    );

    const obj = setupObject(this, EmberObject.extend(ComposedValidations), {
      value: '',
    });

    unsupportedTypes.forEach((type) => {
      obj.set('value', type);
      assert.throws(() => obj.validateSync(), new RegExp(type));
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

          assert.strictEqual(presenceValidator, cache.presence);
        },
      }),
    );

    const obj = setupObject(this, EmberObject.extend(ComposedValidations), {
      value: '',
    });

    obj.validateSync();
  });
});
