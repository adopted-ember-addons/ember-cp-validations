import { not, readOnly, alias } from '@ember/object/computed';
import Controller from '@ember/controller';
import Mixin from '@ember/object/mixin';
import { A, isArray } from '@ember/array';
import { Promise as EmberPromise } from 'rsvp';
import { isNone } from '@ember/utils';
import { later, run } from '@ember/runloop';
import EmberObject, { computed } from '@ember/object';
import setupObject from '../../helpers/setup-object';
import DefaultMessages from 'dummy/validators/messages';
import PresenceValidator from 'dummy/validators/presence';
import LengthValidator from 'dummy/validators/length';
import { validator, buildValidations } from 'ember-cp-validations';
import { module, test, skip } from 'qunit';
import { setupTest } from 'ember-qunit';
import { ATTRS_MODEL } from 'ember-cp-validations/-private/symbols';

const Validators = {
  presence(value, options, model, attr) {
    if (isNone(value)) {
      return `${attr} should be present`;
    }
    return true;
  },
};

let Validations = buildValidations({
  firstName: validator('inline', { validate: Validators.presence }),
  lastName: validator('inline', { validate: Validators.presence }),
});

module('Integration | Validations | Factory - General', function (hooks) {
  setupTest(hooks);

  test('it works', function (assert) {
    assert.ok(buildValidations());
  });

  test('basic sync validation – invalid', function (assert) {
    let object = setupObject(this, EmberObject.extend(Validations));

    assert.equal(
      object.get('validations.isValid'),
      false,
      'isValid was expected to be FALSE'
    );
    assert.equal(
      object.get('validations.isValidating'),
      false,
      'isValidating was expected to be FALSE'
    );
    assert.equal(
      object.get('validations.isTruelyValid'),
      false,
      'isTruelyValid was expected to be FALSE'
    );
    assert.equal(
      object.get('validations.isTruelyInvalid'),
      true,
      'isTruelyInvalid was expected to be TRUE'
    );

    assert.equal(object.get('validations.attrs.firstName.isValid'), false);
    assert.equal(object.get('validations.attrs.firstName.isValidating'), false);
    assert.equal(
      object.get('validations.attrs.firstName.message'),
      'firstName should be present'
    );

    assert.equal(object.get('validations.attrs.lastName.isValid'), false);
    assert.equal(object.get('validations.attrs.lastName.isValidating'), false);
    assert.equal(
      object.get('validations.attrs.lastName.message'),
      'lastName should be present'
    );

    assert.equal(
      object.get('validations.errors.length'),
      2,
      'errors length was expected to be 2'
    );
    assert.ok(
      object
        .get('validations.errors')
        .indexOf(object.get('validations.attrs.firstName.errors.0')) > -1,
      'errors was expected to contain firstName error'
    );
    assert.ok(
      object
        .get('validations.errors')
        .indexOf(object.get('validations.attrs.lastName.errors.0')) > -1,
      'errors was expected to contain lastName error'
    );
    assert.equal(
      object.get('validations.errors.0.attribute'),
      'firstName',
      "error object was expected to have attribute 'firstName'"
    );
    assert.equal(
      object.get('validations.errors.1.attribute'),
      'lastName',
      "error object was expected to have attribute 'lastName'"
    );

    object.set('firstName', 'stef');
    object.set('lastName', 'penner');

    assert.equal(
      object.get('validations.isValid'),
      true,
      'isValid was expected to be TRUE'
    );
    assert.equal(
      object.get('validations.isValidating'),
      false,
      'isValidating was expected to be TRUE'
    );
    assert.equal(
      object.get('validations.isTruelyValid'),
      true,
      'isTruelyValid was expected to be TRUE'
    );
    assert.equal(
      object.get('validations.isTruelyInvalid'),
      false,
      'isTruelyInvalid was expected to be FALSE'
    );

    assert.equal(object.get('validations.attrs.firstName.isValid'), true);
    assert.equal(object.get('validations.attrs.firstName.isValidating'), false);
    assert.equal(object.get('validations.attrs.firstName.message'), null);

    assert.equal(object.get('validations.attrs.lastName.isValid'), true);
    assert.equal(object.get('validations.attrs.lastName.isValidating'), false);
    assert.equal(object.get('validations.attrs.lastName.message'), null);

    assert.equal(
      object.get('validations.errors.length'),
      0,
      'errors length was expected to be 0'
    );
  });

  test('basic sync validation - valid', function (assert) {
    let object = setupObject(this, EmberObject.extend(Validations), {
      firstName: 'Stef',
      lastName: 'Penner',
    });

    assert.equal(
      object.get('validations.isValid'),
      true,
      'isValid was expected to be TRUE'
    );
    assert.equal(
      object.get('validations.isValidating'),
      false,
      'isValidating was expected to be FALSE'
    );
    assert.equal(
      object.get('validations.isTruelyValid'),
      true,
      'isTruelyValid was expected to be TRUE'
    );
    assert.equal(
      object.get('validations.isTruelyInvalid'),
      false,
      'isTruelyInvalid was expected to be FALSE'
    );

    assert.equal(object.get('validations.attrs.firstName.isValid'), true);
    assert.equal(object.get('validations.attrs.firstName.isValidating'), false);
    assert.equal(object.get('validations.attrs.firstName.message'), null);

    assert.equal(object.get('validations.attrs.lastName.isValid'), true);
    assert.equal(object.get('validations.attrs.lastName.isValidating'), false);
    assert.equal(object.get('validations.attrs.lastName.message'), null);
  });

  test('basic sync validation - 50% invalid', function (assert) {
    let object = setupObject(this, EmberObject.extend(Validations), {
      firstName: 'Stef',
    });

    assert.equal(
      object.get('validations.isValid'),
      false,
      'isValid was expected to be FALSE'
    );
    assert.equal(
      object.get('validations.isValidating'),
      false,
      'isValidating was expected to be FALSE'
    );
    assert.equal(
      object.get('validations.isTruelyValid'),
      false,
      'isTruelyValid was expected to be FALSE'
    );
    assert.equal(
      object.get('validations.isTruelyInvalid'),
      true,
      'isTruelyInvalid was expected to be TRUE'
    );

    assert.equal(object.get('validations.attrs.firstName.isValid'), true);
    assert.equal(object.get('validations.attrs.firstName.isValidating'), false);
    assert.equal(object.get('validations.attrs.firstName.message'), null);

    assert.equal(object.get('validations.attrs.lastName.isValid'), false);
    assert.equal(object.get('validations.attrs.lastName.isValidating'), false);
    assert.equal(
      object.get('validations.attrs.lastName.message'),
      'lastName should be present'
    );
  });

  test('basic sync validation - API - #validation', function (assert) {
    let object = setupObject(this, EmberObject.extend(Validations), {
      firstName: 'Stef',
    });

    return object
      .get('validations')
      .validate()
      .then(({ validations, model }) => {
        assert.equal(model, object, 'expected model to be the correct model');
        assert.deepEqual(
          validations.get('content').getEach('attribute').sort(),
          ['firstName', 'lastName'].sort()
        );

        let firstName = validations
          .get('content')
          .findBy('attribute', 'firstName');
        let lastName = validations
          .get('content')
          .findBy('attribute', 'lastName');

        assert.equal(firstName.get('isValid'), true);
        assert.equal(firstName.get('isValidating'), false);
        assert.equal(firstName.get('message'), undefined);

        assert.equal(lastName.get('isValid'), false);
        assert.equal(lastName.get('isValidating'), false);
        assert.equal(lastName.get('message'), 'lastName should be present');

        assert.equal(
          object.get('validations.isValid'),
          false,
          'isValid was expected to be FALSE'
        );
        assert.equal(
          object.get('validations.isValidating'),
          false,
          'isValidating was expected to be FALSE'
        );
        assert.equal(
          object.get('validations.isTruelyValid'),
          false,
          'isTruelyValid was expected to be FALSE'
        );
        assert.equal(
          object.get('validations.isTruelyInvalid'),
          true,
          'isTruelyInvalid was expected to be TRUE'
        );

        assert.equal(object.get('validations.attrs.firstName.isValid'), true);
        assert.equal(
          object.get('validations.attrs.firstName.isValidating'),
          false
        );
        assert.equal(object.get('validations.attrs.firstName.message'), null);

        assert.equal(object.get('validations.attrs.lastName.isValid'), false);
        assert.equal(
          object.get('validations.attrs.lastName.isValidating'),
          false
        );
        assert.equal(
          object.get('validations.attrs.lastName.message'),
          'lastName should be present'
        );
      });
  });

  test('basic sync validation - API - #validationSync', function (assert) {
    let object = setupObject(this, EmberObject.extend(Validations), {
      firstName: 'Stef',
    });

    let { validations, model } = object.get('validations').validateSync();

    assert.equal(model, object, 'expected model to be the correct model');
    assert.deepEqual(
      validations.get('content').getEach('attribute').sort(),
      ['firstName', 'lastName'].sort()
    );

    let firstName = validations.get('content').findBy('attribute', 'firstName');
    let lastName = validations.get('content').findBy('attribute', 'lastName');

    assert.equal(firstName.get('isValid'), true);
    assert.equal(firstName.get('isValidating'), false);
    assert.equal(firstName.get('message'), undefined);

    assert.equal(lastName.get('isValid'), false);
    assert.equal(lastName.get('isValidating'), false);
    assert.equal(lastName.get('message'), 'lastName should be present');

    assert.equal(
      object.get('validations.isValid'),
      false,
      'isValid was expected to be FALSE'
    );
    assert.equal(
      object.get('validations.isValidating'),
      false,
      'isValidating was expected to be FALSE'
    );
    assert.equal(
      object.get('validations.isTruelyValid'),
      false,
      'isTruelyValid was expected to be FALSE'
    );
    assert.equal(
      object.get('validations.isTruelyInvalid'),
      true,
      'isTruelyInvalid was expected to be TRUE'
    );

    assert.equal(object.get('validations.attrs.firstName.isValid'), true);
    assert.equal(object.get('validations.attrs.firstName.isValidating'), false);
    assert.equal(object.get('validations.attrs.firstName.message'), null);

    assert.equal(object.get('validations.attrs.lastName.isValid'), false);
    assert.equal(object.get('validations.attrs.lastName.isValidating'), false);
    assert.equal(
      object.get('validations.attrs.lastName.message'),
      'lastName should be present'
    );
  });

  test('basic sync validation returns null', function (assert) {
    let Validations = buildValidations({
      firstName: validator('inline', { validate: () => null }),
    });
    let object = setupObject(this, EmberObject.extend(Validations), {
      firstName: 'Offir',
    });

    assert.equal(
      object.get('validations.isValid'),
      false,
      'isValid was expected to be FALSE'
    );
    assert.equal(
      object.get('validations.isValidating'),
      false,
      'isValidating was expected to be FALSE'
    );
    assert.equal(
      object.get('validations.isTruelyValid'),
      false,
      'isTruelyValid was expected to be FALSE'
    );
    assert.equal(
      object.get('validations.isTruelyInvalid'),
      true,
      'isTruelyInvalid was expected to be TRUE'
    );

    assert.equal(object.get('validations.attrs.firstName.isValid'), false);
    assert.equal(object.get('validations.attrs.firstName.isValidating'), false);
    assert.equal(object.get('validations.attrs.firstName.message'), undefined);
  });

  test('shallow isAsync test', function (assert) {
    let Validations = buildValidations({
      firstName: validator('inline', {
        validate() {
          return new EmberPromise((resolve) => {
            resolve(true);
          });
        },
      }),
    });

    let obj = setupObject(this, EmberObject.extend(Validations));

    assert.equal(obj.get('validations.attrs.firstName.isAsync'), true);
    assert.equal(obj.get('validations.attrs.firstName.isValidating'), true);

    return obj.validate().then(({ model }) => {
      assert.equal(model.get('validations.isValid'), true);
      assert.equal(model.get('validations.isValidating'), false);
    });
  });

  test('default options', function (assert) {
    let Validations = buildValidations({
      firstName: {
        description: 'Test field',
        validators: [
          validator('inline', { validate: Validators.presence }),
          validator('inline', { validate: () => false }),
        ],
      },
    });
    let object = setupObject(this, EmberObject.extend(Validations), {
      firstName: '',
    });
    let rules = A(object.get('validations._validationRules.firstName'));
    assert.equal(rules.isAny('defaultOptions', undefined), false);
    assert.equal(rules[0].defaultOptions.description, 'Test field');
  });

  test('global options', function (assert) {
    this.owner.register('validator:length', LengthValidator);

    let Validations = buildValidations(
      {
        firstName: {
          description: 'Test field',
          validators: [validator('length', { min: 1, max: 5 })],
        },
      },
      {
        message: 'Global error message',
        description: 'Default field',
        max: 10,
      }
    );

    let object = setupObject(this, EmberObject.extend(Validations), {
      firstName: '',
    });

    // Global options present in rules
    let rules = A(object.get('validations._validationRules.firstName'));
    assert.equal(rules.isAny('globalOptions', undefined), false);
    assert.equal(rules[0].globalOptions.max, 10);

    assert.ok(object.get('validations.attrs.firstName.isInvalid'));

    let v = object.get('validations._validators.firstName.0');
    assert.deepEqual(
      v.get('options').getProperties(['message', 'description', 'min', 'max']),
      {
        message: 'Global error message',
        description: 'Test field',
        min: 1,
        max: 5,
      }
    );
  });

  test('custom messages object', function (assert) {
    this.owner.register('validator:messages', DefaultMessages);
    let Validations = buildValidations({
      firstName: validator('inline', {
        validate(value) {
          return this.createErrorMessage('test', value);
        },
      }),
    });

    let object = setupObject(this, EmberObject.extend(Validations));

    assert.equal(object.get('validations.attrs.firstName.isValid'), false);
    assert.equal(object.get('validations.attrs.firstName.isValidating'), false);
    assert.equal(
      object.get('validations.attrs.firstName.message'),
      'Test error message'
    );
  });

  test('null message object', function (assert) {
    this.owner.register('validator:messages', DefaultMessages);
    let Validations = buildValidations({
      firstName: validator('presence', {
        presence: true,
        message: null,
      }),
    });

    let object = setupObject(this, EmberObject.extend(Validations));

    assert.equal(
      object.get('validations.attrs.firstName.message'),
      "This field can't be blank"
    );
  });

  test('debounced validations', async function (assert) {
    let initSetup = true;
    let Validations = buildValidations({
      firstName: validator('inline', { validate: Validators.presence }),
      lastName: validator('inline', {
        validate: Validators.presence,
        debounce: computed(function () {
          return initSetup ? 0 : 500; // Do not debounce on initial object creation
        }).volatile(),
      }),
    });
    let object = setupObject(this, EmberObject.extend(Validations));

    assert.equal(
      object.get('validations.isValid'),
      false,
      'isValid was expected to be FALSE'
    );
    assert.equal(
      object.get('validations.isValidating'),
      false,
      'isValidating was expected to be TRUE'
    );
    assert.equal(
      object.get('validations.isTruelyValid'),
      false,
      'isTruelyValid was expected to be FALSE'
    );
    assert.equal(
      object.get('validations.isTruelyInvalid'),
      true,
      'isTruelyInvalid was expected to be TRUE'
    );

    assert.equal(object.get('validations.attrs.lastName.isValid'), false);
    assert.equal(object.get('validations.attrs.lastName.isValidating'), false);
    assert.equal(
      object.get('validations.attrs.lastName.message'),
      'lastName should be present'
    );

    initSetup = false;
    object.set('lastName', 'Golan');
    assert.equal(object.get('validations.attrs.lastName.isValidating'), true);

    await later(() => {
      assert.equal(object.get('validations.attrs.lastName.isValid'), true);
      assert.equal(
        object.get('validations.attrs.lastName.isValidating'),
        false
      );
      assert.equal(object.get('validations.attrs.lastName.message'), null);
    }, 505);
  });

  test('debounced validator should only be called once', async function (assert) {
    let count = 0;
    let Validations = buildValidations({
      firstName: validator('inline', {
        validate: () => count++,
        debounce: 500,
      }),
    });

    let object = setupObject(this, EmberObject.extend(Validations));

    object.set('firstName', 'O');
    object.get('validations.attrs.firstName.isValid');

    object.set('firstName', 'Off');
    object.get('validations.attrs.firstName.isValid');

    object.set('firstName', 'Offir');
    object.get('validations.attrs.firstName.isValid');

    await later(() => {
      assert.equal(count, 1);
    }, 505);
  });

  test('debounced validations should cleanup on object destroy', function (assert) {
    let done = assert.async();
    let initSetup = true;

    let debouncedValidator = validator('inline', {
      debounce: computed(function () {
        return initSetup ? 0 : 500;
      }).volatile(),
      validate(value, options, model, attr) {
        model.set('foo', 'bar');
        return Validators.presence(value, options, model, attr);
      },
    });

    let Validations = buildValidations({
      firstName: validator('inline', { validate: Validators.presence }),
      lastName: debouncedValidator,
      'details.url': debouncedValidator,
    });
    let object = setupObject(this, EmberObject.extend(Validations), {
      details: {},
    });

    assert.equal(
      object.get('validations.isValid'),
      false,
      'isValid was expected to be FALSE'
    );
    assert.equal(
      object.get('validations.isValidating'),
      false,
      'isValidating was expected to be TRUE'
    );
    assert.equal(
      object.get('validations.isTruelyValid'),
      false,
      'isTruelyValid was expected to be FALSE'
    );
    assert.equal(
      object.get('validations.isTruelyInvalid'),
      true,
      'isTruelyInvalid was expected to be TRUE'
    );

    assert.equal(object.get('validations.attrs.lastName.isValid'), false);
    assert.equal(object.get('validations.attrs.lastName.isValidating'), false);
    assert.equal(
      object.get('validations.attrs.lastName.message'),
      'lastName should be present'
    );

    initSetup = false;
    object.setProperties({
      lastName: 'Golan',
      'details.url': 'github.com',
    });
    assert.equal(object.get('validations.attrs.lastName.isValidating'), true);
    assert.equal(
      object.get('validations.attrs.details.url.isValidating'),
      true
    );

    later(() => {
      try {
        object.destroy();
        assert.ok(true, 'Object destroy was clean');
      } catch (e) {
        /* noop */
      }
      later(() => {
        done();
      }, 400);
    }, 200);
  });

  test('disabled validations - simple', function (assert) {
    let Validations = buildValidations({
      firstName: validator('inline', { validate: Validators.presence }),
      lastName: validator('inline', {
        validate: Validators.presence,
        disabled: true,
      }),
    });
    let object = setupObject(this, EmberObject.extend(Validations));

    assert.equal(
      object.get('validations.isValid'),
      false,
      'isValid was expected to be FALSE'
    );
    assert.equal(
      object.get('validations.isValidating'),
      false,
      'isValidating was expected to be TRUE'
    );
    assert.equal(
      object.get('validations.isTruelyValid'),
      false,
      'isTruelyValid was expected to be FALSE'
    );
    assert.equal(
      object.get('validations.isTruelyInvalid'),
      true,
      'isTruelyInvalid was expected to be TRUE'
    );

    assert.equal(object.get('validations.attrs.lastName.isValid'), true);
    assert.equal(object.get('validations.attrs.firstName.isValid'), false);

    object.set('firstName', 'Offir');

    assert.equal(object.get('validations.isValid'), true);
  });

  test('disabled validations - cp with dependent key', function (assert) {
    let Validations = buildValidations({
      firstName: validator('inline', { validate: Validators.presence }),
      lastName: validator('inline', {
        validate: Validators.presence,
        disabled: not('model.validateLastName'),
      }),
    });
    let object = setupObject(
      this,
      EmberObject.extend(Validations, {
        firstName: 'Offir',
        validateLastName: true,
      })
    );

    assert.equal(
      object.get('validations.isValid'),
      false,
      'isValid was expected to be FALSE'
    );
    assert.equal(
      object.get('validations.isValidating'),
      false,
      'isValidating was expected to be TRUE'
    );
    assert.equal(
      object.get('validations.isTruelyValid'),
      false,
      'isTruelyValid was expected to be FALSE'
    );
    assert.equal(
      object.get('validations.isTruelyInvalid'),
      true,
      'isTruelyInvalid was expected to be TRUE'
    );

    assert.equal(object.get('validations.attrs.lastName.isValid'), false);
    assert.equal(object.get('validations.attrs.firstName.isValid'), true);

    object.set('validateLastName', false);

    assert.equal(object.get('validations.attrs.lastName.isValid'), true);
    assert.equal(object.get('validations.isValid'), true);
  });

  test('attribute validation result options hash', function (assert) {
    this.owner.register('validator:length', LengthValidator);
    this.owner.register('validator:presence', PresenceValidator);

    let Validations = buildValidations({
      firstName: {
        description: 'First Name',
        validators: [
          validator('inline', { validate: Validators.presence }),
          validator('inline', {
            validate: Validators.presence,
            presence: true,
          }),
          validator('presence', true),
          validator('length', {
            min: 1,
            max: 5,
          }),
        ],
      },
    });
    let object = setupObject(this, EmberObject.extend(Validations, { max: 5 }));
    let options = object.get('validations.attrs.firstName.options');

    assert.ok(options);
    assert.deepEqual(
      Object.keys(options).sort(),
      ['presence', 'length', 'inline'].sort()
    );
    assert.ok(isArray(options['inline']) && options['inline'].length === 2);
    assert.ok(options.presence.presence);
    assert.equal(options.length.min, 1);
    assert.ok(options['inline'][1].presence);

    // Default options built into option objects
    assert.equal(options.length.description, 'First Name');
    assert.equal(options.presence.description, 'First Name');
    assert.equal(options['inline'][0].description, 'First Name');
  });

  test('attribute validation result options hash with cps', function (assert) {
    this.owner.register('validator:length', LengthValidator);

    let Validations = buildValidations({
      firstName: {
        validators: [
          validator('length', {
            min: 1,
            max: readOnly('model.max'),
          }),
        ],
      },
    });
    let object = setupObject(this, EmberObject.extend(Validations, { max: 5 }));
    let options = object.get('validations.attrs.firstName.options');
    assert.equal(options.length.max, 5);

    run(() => object.set('max', 3));

    options = object.get('validations.attrs.firstName.options');
    assert.equal(options.length.max, 3);
  });

  test('validations persist with inheritance', function (assert) {
    let Parent = EmberObject.extend(
      buildValidations({
        firstName: validator('inline', { validate: Validators.presence }),
        lastName: validator('inline', { validate: Validators.presence }),
      })
    );

    let Child = Parent.extend(
      buildValidations({
        middleName: validator('inline', { validate: Validators.presence }),
        dob: validator('inline', { validate: Validators.presence }),
      })
    );

    let child = setupObject(this, Child);

    child.validateSync();

    assert.equal(child.get('validations.errors.length'), 4);
    assert.equal(child.get('validations.isValid'), false);
    assert.deepEqual(
      child.get('validations.validatableAttributes').sort(),
      ['firstName', 'lastName', 'middleName', 'dob'].sort()
    );

    child.setProperties({
      middleName: 'John',
      dob: '10/22/16',
    });

    assert.equal(child.get('validations.errors.length'), 2);

    child.setProperties({
      firstName: 'Joe',
      lastName: 'Jenkins',
    });

    assert.equal(child.get('validations.isValid'), true);
    assert.equal(child.get('validations.errors.length'), 0);
  });

  test('validations persist with deep inheritance', function (assert) {
    let Parent = EmberObject.extend(
      buildValidations({
        firstName: validator('inline', { validate: Validators.presence }),
        lastName: validator('inline', { validate: Validators.presence }),
      })
    );

    let Child = Parent.extend(
      buildValidations({
        middleName: validator('inline', { validate: Validators.presence }),
        dob: validator('inline', { validate: Validators.presence }),
      })
    );

    let Baby = Child.extend(
      buildValidations({
        diaper: validator('inline', { validate: Validators.presence }),
        favParent: validator('inline', { validate: Validators.presence }),
      })
    );

    let baby = setupObject(this, Baby);

    baby.validateSync();

    assert.equal(baby.get('validations.errors.length'), 6);
    assert.equal(baby.get('validations.isValid'), false);
    assert.deepEqual(
      baby.get('validations.validatableAttributes').sort(),
      [
        'firstName',
        'lastName',
        'middleName',
        'dob',
        'diaper',
        'favParent',
      ].sort()
    );

    baby.setProperties({
      middleName: 'John',
      dob: '10/22/16',
    });

    assert.equal(baby.get('validations.errors.length'), 4);

    baby.setProperties({
      firstName: 'Joe',
      lastName: 'Jenkins',
    });

    assert.equal(baby.get('validations.errors.length'), 2);

    baby.setProperties({
      diaper: 'soiled',
      favParent: 'mom',
    });

    assert.equal(baby.get('validations.isValid'), true);
    assert.equal(baby.get('validations.errors.length'), 0);
  });

  test('nested keys - simple', function (assert) {
    let Validations = buildValidations({
      'user.firstName': validator('inline', { validate: Validators.presence }),
      'user.lastName': validator('inline', { validate: Validators.presence }),
    });
    let object = setupObject(this, EmberObject.extend(Validations), {
      user: {},
    });

    assert.equal(object.get('validations.attrs.user.firstName.isValid'), false);
    assert.equal(object.get('validations.attrs.user.lastName.isValid'), false);
    assert.equal(object.get('validations.isValid'), false);

    object.set('user.firstName', 'Offir');

    assert.equal(object.get('validations.attrs.user.firstName.isValid'), true);
    assert.equal(object.get('validations.isValid'), false);

    object.set('user.lastName', 'Golan');

    assert.equal(object.get('validations.attrs.user.lastName.isValid'), true);
    assert.equal(object.get('validations.isValid'), true);
  });

  test('nested keys - complex', function (assert) {
    let Validations = buildValidations({
      firstName: validator('inline', { validate: Validators.presence }),
      'user.foo.bar.baz': validator('inline', {
        validate: Validators.presence,
      }),
      'user.foo.boop': validator('inline', { validate: Validators.presence }),
    });
    let object = setupObject(this, EmberObject.extend(Validations));

    assert.equal(object.get('validations.attrs.firstName.isValid'), false);
    assert.equal(
      object.get('validations.attrs.user.foo.bar.baz.isValid'),
      false
    );
    assert.equal(object.get('validations.attrs.user.foo.boop.isValid'), false);
    assert.equal(object.get('validations.isValid'), false);

    object.set('user', { foo: { bar: {} } });

    assert.equal(object.get('validations.attrs.firstName.isValid'), false);
    assert.equal(
      object.get('validations.attrs.user.foo.bar.baz.isValid'),
      false
    );
    assert.equal(object.get('validations.attrs.user.foo.boop.isValid'), false);
    assert.equal(object.get('validations.isValid'), false);

    object.set('firstName', 'Offir');
    object.set('user.foo.bar.baz', 'blah');
    object.set('user.foo.boop', 'blah');

    assert.equal(object.get('validations.attrs.firstName.isValid'), true);
    assert.equal(
      object.get('validations.attrs.user.foo.bar.baz.isValid'),
      true
    );
    assert.equal(object.get('validations.attrs.user.foo.boop.isValid'), true);

    assert.ok(object.get(`validations.attrs.${ATTRS_MODEL}`));
    assert.ok(object.get(`validations.attrs.user.foo.bar.${ATTRS_MODEL}`));
    assert.ok(object.get(`validations.attrs.user.foo.${ATTRS_MODEL}`));

    assert.equal(object.get('validations.isValid'), true);

    run(() => object.destroy());

    assert.notOk(object.get(`validations.attrs.${ATTRS_MODEL}`));
    assert.notOk(object.get(`validations.attrs.user.foo.bar.${ATTRS_MODEL}`));
    assert.notOk(object.get(`validations.attrs.user.foo.${ATTRS_MODEL}`));
  });

  test('nested keys - inheritance', function (assert) {
    let Parent = EmberObject.extend(
      buildValidations({
        firstName: validator('inline', { validate: Validators.presence }),
        'user.firstName': validator('inline', {
          validate: Validators.presence,
        }),
        'user.middleName': validator('inline', {
          validate: Validators.presence,
        }),
      })
    );

    let Child = Parent.extend(
      buildValidations({
        'user.lastName': validator('inline', { validate: Validators.presence }),
        'user.middleName': validator('inline', {
          validate() {
            return 'Middle name invalid';
          },
        }),
      })
    );

    let child = setupObject(this, Child);

    child.validateSync();

    assert.equal(child.get('validations.errors.length'), 4);
    assert.equal(child.get('validations.isValid'), false);
    assert.deepEqual(
      child.get('validations.validatableAttributes').sort(),
      ['firstName', 'user.firstName', 'user.middleName', 'user.lastName'].sort()
    );

    child.setProperties({
      user: {
        firstName: 'Offir',
        middleName: 'David',
        lastName: 'Golan',
      },
    });

    assert.equal(child.get('validations.errors.length'), 2);
    assert.equal(
      child.get('validations.attrs.user.middleName.message'),
      'Middle name invalid'
    );

    child.setProperties({
      firstName: 'John',
    });

    assert.equal(child.get('validations.isValid'), false);
    assert.equal(child.get('validations.errors.length'), 1);
  });

  // https://github.com/offirgolan/ember-cp-validations/pull/656
  skip('call super in validations class with no super property', function (assert) {
    // see https://github.com/offirgolan/ember-cp-validations/issues/149
    assert.expect(1);

    let Validations = buildValidations({
      firstName: validator('inline', { validate: Validators.presence }),
    });

    let mixin = Mixin.create({
      actions: {
        foo() {
          // The issue is that __validationsClass__ is calling super but since
          // this is no __validationsClass__ method on the super, it is wrapped
          // with the closest context which is the 'foo' action
          assert.ok(false); // should not reach here
        },
      },
    });

    let controller = setupObject(
      this,
      Controller.extend(Validations, mixin, {
        // eslint-disable-next-line ember/no-actions-hash
        actions: {
          foo() {
            assert.ok(true);
            /* eslint-disable */
            let validations = this.get('validations');
            /* eslint-enable */
          },
        },
      })
    );

    controller.send('foo');
  });

  test('multiple mixins', function (assert) {
    let Validations1 = buildValidations({
      firstName: validator('inline', { validate: Validators.presence }),
    });

    let Validations2 = buildValidations({
      middleName: validator('inline', { validate: Validators.presence }),
    });

    let Validations3 = buildValidations({
      lastName: validator('inline', { validate: Validators.presence }),
    });

    let object = setupObject(
      this,
      EmberObject.extend(Validations1, Validations2, Validations3)
    );

    assert.deepEqual(
      object.get('validations.validatableAttributes').sort(),
      ['firstName', 'middleName', 'lastName'].sort()
    );
    assert.equal(object.get('validations.attrs.firstName.isValid'), false);
    assert.equal(object.get('validations.attrs.lastName.isValid'), false);
    assert.equal(object.get('validations.isValid'), false);

    object.set('firstName', 'Offir');

    assert.equal(object.get('validations.attrs.firstName.isValid'), true);
    assert.equal(object.get('validations.isValid'), false);

    object.set('middleName', 'David');

    assert.equal(object.get('validations.attrs.middleName.isValid'), true);
    assert.equal(object.get('validations.isValid'), false);

    object.set('lastName', 'Golan');

    assert.equal(object.get('validations.attrs.lastName.isValid'), true);
    assert.equal(object.get('validations.isValid'), true);
  });

  test('validateAttribute - sync validations', function (assert) {
    let Validations = buildValidations({
      firstName: [
        validator('inline', { validate: Validators.presence }),
        validator('inline', { validate: () => true }),
      ],
    });
    let object = setupObject(this, EmberObject.extend(Validations), {
      firstName: 'Offir',
    });

    return object
      .validateAttribute('firstName', undefined)
      .then(({ validations, model }) => {
        assert.equal(model.get('validations.isValid'), true);
        assert.equal(validations.get('isValid'), false);
        assert.equal(validations.get('isValidating'), false);
        assert.equal(validations.get('message'), 'firstName should be present');
      });
  });

  test('validateAttribute - async validations', function (assert) {
    let Validations = buildValidations({
      firstName: [
        validator('inline', {
          validate: () => EmberPromise.resolve('firstName is invalid'),
        }),
        validator('inline', {
          validate: () => EmberPromise.resolve('firstName is really invalid'),
        }),
      ],
    });
    let object = setupObject(this, EmberObject.extend(Validations), {
      firstName: 'Offir',
    });

    return object
      .validateAttribute('firstName', 'foo')
      .then(({ validations }) => {
        assert.equal(validations.get('isValid'), false);
        assert.equal(validations.get('isValidating'), false);
        assert.equal(validations.get('message'), 'firstName is invalid');
      });
  });

  test('warning validators api', function (assert) {
    this.owner.register('validator:length', LengthValidator);
    this.owner.register('validator:presence', PresenceValidator);

    let Validations = buildValidations({
      password: {
        description: 'Password',
        validators: [
          validator('presence', {
            presence: true,
            isWarning: true,
            message: '{description} should not be empty',
          }),
          validator('length', {
            min: 4,
            isWarning: true,
            message: '{description} is weak',
          }),
          validator('length', {
            min: 1,
            max: 10,
          }),
        ],
      },
    });

    let object = setupObject(this, EmberObject.extend(Validations), {
      password: '',
    });

    assert.equal(object.get('validations.isValid'), false);
    assert.equal(object.get('validations.warnings.length'), 2);
    assert.equal(
      object.get('validations.warningMessage'),
      'Password should not be empty'
    );
    assert.equal(
      object.get('validations.message'),
      'Password is too short (minimum is 1 characters)'
    );

    assert.equal(object.get('validations.attrs.password.isValid'), false);
    assert.equal(object.get('validations.attrs.password.warnings.length'), 2);
    assert.equal(
      object.get('validations.attrs.password.warningMessage'),
      'Password should not be empty'
    );
    assert.equal(
      object.get('validations.attrs.password.message'),
      'Password is too short (minimum is 1 characters)'
    );

    object.set('password', 'wat');

    assert.equal(object.get('validations.isValid'), true);
    assert.equal(object.get('validations.attrs.password.isValid'), true);
    assert.equal(object.get('validations.attrs.password.warnings.length'), 1);
    assert.equal(
      object.get('validations.attrs.password.warningMessage'),
      'Password is weak'
    );
  });

  test('computed isWarning option', function (assert) {
    this.owner.register('validator:length', LengthValidator);
    this.owner.register('validator:presence', PresenceValidator);

    let Validations = buildValidations({
      password: {
        description: 'Password',
        lazy: false,
        validators: [
          validator('presence', {
            presence: true,
            isWarning: readOnly('model.isWarning'),
            message: '{description} should not be empty',
          }),
          validator('length', {
            min: 1,
            max: 10,
          }),
        ],
      },
    });

    let object = setupObject(this, EmberObject.extend(Validations), {
      password: '',
      isWarning: false,
    });

    assert.equal(object.get('validations.isValid'), false);
    assert.equal(object.get('validations.warnings.length'), 0);
    assert.equal(object.get('validations.errors.length'), 2);

    object.set('isWarning', true);

    assert.equal(object.get('validations.warnings.length'), 1);
    assert.equal(object.get('validations.errors.length'), 1);
  });

  test('options CP changes trigger attribute revalidation', function (assert) {
    this.owner.register('validator:length', LengthValidator);

    let Validations = buildValidations(
      {
        firstName: {
          description: readOnly('model.description'),
          validators: [
            validator('length', {
              min: alias('model.minLength'),
            }),
          ],
        },
      },
      {
        disabled: not('model.enabled'),
      }
    );

    let object = setupObject(
      this,
      EmberObject.extend(Validations, {
        enabled: true,
        description: 'First Name',
        minLength: 6,
        firstName: 'Offir',
      })
    );

    assert.equal(
      object.get('validations.isValid'),
      false,
      'isValid was expected to be FALSE'
    );
    assert.equal(
      object.get('validations.isValidating'),
      false,
      'isValidating was expected to be FALSE'
    );
    assert.equal(
      object.get('validations.isTruelyValid'),
      false,
      'isTruelyValid was expected to be FALSE'
    );
    assert.equal(
      object.get('validations.isTruelyInvalid'),
      true,
      'isTruelyInvalid was expected to be TRUE'
    );

    assert.equal(object.get('validations.attrs.firstName.isValid'), false);
    assert.equal(
      object.get('validations.attrs.firstName.message'),
      'First Name is too short (minimum is 6 characters)'
    );

    object.setProperties({
      description: 'Name',
      minLength: 10,
    });

    assert.equal(object.get('validations.attrs.firstName.isValid'), false);
    assert.equal(
      object.get('validations.attrs.firstName.message'),
      'Name is too short (minimum is 10 characters)'
    );

    object.set('enabled', false);

    assert.equal(object.get('validations.attrs.firstName.isValid'), true);
    assert.equal(
      object.get('validations.isValid'),
      true,
      'isValid was expected to be FALSE'
    );
  });

  test('lazy validators are actually lazy', function (assert) {
    this.owner.register('validator:length', LengthValidator);
    this.owner.register('validator:presence', PresenceValidator);

    let customValidatorCount = 0;

    let Validations = buildValidations({
      password: {
        description: 'Password',
        validators: [
          validator('presence', true),
          validator('length', {
            min: 5,
          }),
          validator('inline', {
            validate() {
              customValidatorCount++;
              return 'Password is not valid';
            },
          }),
        ],
      },
    });

    let object = setupObject(this, EmberObject.extend(Validations));

    assert.equal(object.get('validations.attrs.password.isValid'), false);
    assert.equal(
      object.get('validations.attrs.password.messages.length'),
      1,
      'Only 1 error message should be present'
    );
    assert.equal(
      object.get('validations.attrs.password.message'),
      "Password can't be blank"
    );

    object.set('password', '1234');

    assert.equal(object.get('validations.attrs.password.isValid'), false);
    assert.equal(
      object.get('validations.attrs.password.messages.length'),
      1,
      'Only 1 error message should be present'
    );
    assert.equal(
      object.get('validations.attrs.password.message'),
      'Password is too short (minimum is 5 characters)'
    );

    object.set('password', '12345');

    assert.equal(object.get('validations.attrs.password.isValid'), false);
    assert.equal(
      object.get('validations.attrs.password.messages.length'),
      1,
      'Only 1 error message should be present'
    );
    assert.equal(
      object.get('validations.attrs.password.message'),
      'Password is not valid'
    );
    assert.equal(customValidatorCount, 1, 'Last validator only executed once');
  });

  test('none lazy validators are actually not lazy', function (assert) {
    this.owner.register('validator:length', LengthValidator);
    this.owner.register('validator:presence', PresenceValidator);

    let customValidatorCount = 0;

    let Validations = buildValidations({
      password: {
        description: 'Password',
        validators: [
          validator('presence', true),
          validator('length', {
            min: 5,
            lazy: false,
          }),
          validator('inline', {
            lazy: false,
            validate() {
              customValidatorCount++;
              return 'Password is not valid';
            },
          }),
        ],
      },
    });

    let object = setupObject(this, EmberObject.extend(Validations));

    assert.equal(object.get('validations.attrs.password.isValid'), false);
    assert.equal(
      object.get('validations.attrs.password.messages.length'),
      2,
      'Only 2 error message should be present'
    );
    assert.equal(
      object.get('validations.attrs.password.message'),
      "Password can't be blank"
    );

    object.set('password', '1234');

    assert.equal(object.get('validations.attrs.password.isValid'), false);
    assert.equal(
      object.get('validations.attrs.password.messages.length'),
      2,
      'Only 2 error message should be present'
    );
    assert.equal(
      object.get('validations.attrs.password.message'),
      'Password is too short (minimum is 5 characters)'
    );

    object.set('password', '12345');

    assert.equal(object.get('validations.attrs.password.isValid'), false);
    assert.equal(
      object.get('validations.attrs.password.messages.length'),
      1,
      'Only 1 error message should be present'
    );
    assert.equal(
      object.get('validations.attrs.password.message'),
      'Password is not valid'
    );
    assert.equal(customValidatorCount, 3, 'Last validator executed 3 times');
  });

  test('validator should return correct error type', function (assert) {
    this.owner.register('validator:presence', PresenceValidator);
    this.owner.register('validator:length', LengthValidator);

    let Validations = buildValidations({
      firstName: [
        validator('presence', true),
        validator('length', { min: 5, max: 35 }),
      ],
      lastName: [
        validator('presence', true),
        validator('length', { min: 5, max: 35 }),
      ],
    });

    let obj = setupObject(this, EmberObject.extend(Validations), {
      firstName: 'Foo',
      lastName: null,
    });

    assert.equal(
      obj.get('validations.attrs.firstName.isValid'),
      false,
      'isValid was expected to be FALSE'
    );
    assert.equal(
      obj.get('validations.attrs.lastName.error.type'),
      'presence',
      'error type was expected to be `presence`'
    );
    assert.equal(
      obj.get('validations.errors.length'),
      2,
      'number of errors was expected to be 2'
    );
    assert.equal(
      obj.get('validations.errors').filterBy('type', 'presence').length,
      1,
      'number of errors was expected to be 1'
    );
  });

  test('volatile validations should not recompute', function (assert) {
    this.owner.register('validator:presence', PresenceValidator);
    this.owner.register('validator:length', LengthValidator);

    let Validations = buildValidations({
      firstName: [
        validator('presence', true),
        validator('length', {
          dependentKeys: ['model.foo'],
          min: 5,
          max: 35,
          volatile: true,
        }),
      ],
    });

    let obj = setupObject(
      this,
      EmberObject.extend(Validations, {
        isInvalid: not('validations.attrs.firstName.isValid'),
        isInvalidGlobal: not('validations.attrs.isValid'),
      }),
      {
        firstName: null,
      }
    );

    assert.equal(
      obj.get('validations.attrs.firstName.isValid'),
      false,
      'isValid was expected to be FALSE'
    );
    assert.equal(
      obj.get('validations.attrs.firstName.message'),
      "This field can't be blank"
    );
    assert.equal(
      obj.get('isInvalid'),
      true,
      'isInvalid was expected to be TRUE'
    );
    assert.equal(
      obj.get('isInvalidGlobal'),
      true,
      'isInvalidGlobal was expected to be TRUE'
    );

    obj.set('firstName', 'Offir');
    obj.set('foo', 'bar');

    assert.equal(
      obj.get('isInvalid'),
      true,
      'isInvalid was expected to be TRUE'
    );
    assert.equal(
      obj.get('isInvalidGlobal'),
      true,
      'isInvalidGlobal was expected to be TRUE'
    );
    assert.equal(
      obj.get('validations.attrs.firstName.isValid'),
      true,
      'isValid was expected to be TRUE'
    );
  });

  test('load test', function (assert) {
    this.owner.register('validator:presence', PresenceValidator);

    let Validations = buildValidations({
      a: validator('presence', true),
      b: validator('presence', true),
      c: validator('presence', true),
      d: validator('presence', true),
      e: validator('presence', true),
    });

    let Klass = EmberObject.extend(Validations, {
      a: null,
      b: null,
      c: null,
      d: null,
      e: null,
    });

    let items = A([]);
    for (let i = 0; i < 50; i++) {
      let obj = setupObject(this, Klass, {
        a: i,
        b: i,
        c: i,
        d: i,
        e: i,
      });
      items.push(obj);
    }
    /* eslint-disable no-console */
    console.time('init');
    items.mapBy('validations.isValid');
    console.timeEnd('init');

    items.forEach((item, i) => {
      item.setProperties({
        a: i + 1000,
        b: i + 1000,
        c: i + 1000,
        d: i + 1000,
        e: i + 1000,
      });
    });

    console.time('after set');
    A(items).mapBy('validations.isValid');
    console.timeEnd('after set');
    /* eslint-enable no-console */

    assert.ok(true);
  });
});
