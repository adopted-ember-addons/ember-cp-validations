import { A, isArray } from '@ember/array';
import { Promise as EmberPromise } from 'rsvp';
import { isNone } from '@ember/utils';
import { run } from '@ember/runloop';
import setupObject from '../../helpers/setup-object';
import DefaultMessages from 'dummy/validators/messages';
import PresenceValidator from 'dummy/validators/presence';
import LengthValidator from 'dummy/validators/length';
import { validator, buildValidations } from 'ember-cp-validations';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

const Validators = {
  presence(value, options, model, attr) {
    if (isNone(value)) {
      return `${attr} should be present`;
    }
    return true;
  },
};

let Validations = {
  firstName: validator('inline', { validate: Validators.presence }),
  lastName: validator('inline', { validate: Validators.presence }),
};

module('Integration | Validations | Factory - General', function (hooks) {
  setupTest(hooks);

  test('basic sync validation – invalid', function (assert) {
    let object = setupObject(this, Validations);

    assert.false(
      object.validations.isValid,
      'isValid was expected to be FALSE'
    );
    assert.false(
      object.validations.isValidating,
      'isValidating was expected to be FALSE'
    );
    assert.false(
      object.validations.isTruelyValid,
      'isTruelyValid was expected to be FALSE'
    );
    assert.true(
      object.validations.isTruelyInvalid,
      'isTruelyInvalid was expected to be TRUE'
    );

    assert.false(object.validations.attrs.firstName.isValid);
    assert.false(object.validations.attrs.firstName.isValidating);
    assert.deepEqual(
      object.validations.attrs.firstName.message,
      'firstName should be present'
    );

    assert.false(object.validations.attrs.lastName.isValid);
    assert.false(object.validations.attrs.lastName.isValidating);
    assert.deepEqual(
      object.validations.attrs.lastName.message,
      'lastName should be present'
    );

    assert.deepEqual(
      object.validations.errors.length,
      2,
      'errors length was expected to be 2'
    );
    assert.deepEqual(
      object.validations.errors[0].message,
      object.validations.attrs.firstName.errors[0].message,
      'errors was expected to contain firstName error'
    );
    assert.ok(
      object.validations.errors[1].message,
      object.validations.attrs.lastName.errors[0].message,
      'errors was expected to contain lastName error'
    );
    assert.deepEqual(
      object.validations.errors[0].attribute,
      'firstName',
      "error object was expected to have attribute 'firstName'"
    );
    assert.deepEqual(
      object.validations.errors[1].attribute,
      'lastName',
      "error object was expected to have attribute 'lastName'"
    );

    Object.assign(object, {
      firstName: 'stef',
      lastName: 'penner',
    });

    assert.true(object.validations.isValid, 'isValid was expected to be TRUE');
    assert.false(
      object.validations.isValidating,
      'isValidating was expected to be TRUE'
    );
    assert.true(
      object.validations.isTruelyValid,
      'isTruelyValid was expected to be TRUE'
    );
    assert.false(
      object.validations.isTruelyInvalid,
      'isTruelyInvalid was expected to be FALSE'
    );

    assert.true(object.validations.attrs.firstName.isValid);
    assert.false(object.validations.attrs.firstName.isValidating);
    assert.deepEqual(object.validations.attrs.firstName.message, undefined);

    assert.true(object.validations.attrs.lastName.isValid);
    assert.false(object.validations.attrs.lastName.isValidating);
    assert.deepEqual(object.validations.attrs.lastName.message, undefined);

    assert.deepEqual(
      object.validations.errors.length,
      0,
      'errors length was expected to be 0'
    );
  });

  test('basic sync validation - valid', function (assert) {
    let object = setupObject(this, Validations, {
      firstName: 'Stef',
      lastName: 'Penner',
    });

    assert.true(object.validations.isValid, 'isValid was expected to be TRUE');
    assert.false(
      object.validations.isValidating,
      'isValidating was expected to be FALSE'
    );
    assert.true(
      object.validations.isTruelyValid,
      'isTruelyValid was expected to be TRUE'
    );
    assert.false(
      object.validations.isTruelyInvalid,
      'isTruelyInvalid was expected to be FALSE'
    );

    assert.true(object.validations.attrs.firstName.isValid);
    assert.false(object.validations.attrs.firstName.isValidating);
    assert.deepEqual(object.validations.attrs.firstName.message, null);

    assert.true(object.validations.attrs.lastName.isValid);
    assert.false(object.validations.attrs.lastName.isValidating);
    assert.deepEqual(object.validations.attrs.lastName.message, null);
  });

  test('basic sync validation - 50% invalid', function (assert) {
    let object = setupObject(this, Validations, {
      firstName: 'Stef',
    });

    assert.false(
      object.validations.isValid,
      'isValid was expected to be FALSE'
    );
    assert.false(
      object.validations.isValidating,
      'isValidating was expected to be FALSE'
    );
    assert.false(
      object.validations.isTruelyValid,
      'isTruelyValid was expected to be FALSE'
    );
    assert.true(
      object.validations.isTruelyInvalid,
      'isTruelyInvalid was expected to be TRUE'
    );

    assert.true(object.validations.attrs.firstName.isValid);
    assert.false(object.validations.attrs.firstName.isValidating);
    assert.deepEqual(object.validations.attrs.firstName.message, null);

    assert.false(object.validations.attrs.lastName.isValid);
    assert.false(object.validations.attrs.lastName.isValidating);
    assert.deepEqual(
      object.validations.attrs.lastName.message,
      'lastName should be present'
    );
  });

  test('basic sync validation - API - #validation', function (assert) {
    assert.expect(18);
    let object = setupObject(this, Validations, {
      firstName: 'Stef',
    });

    return object.validations.validate().then(({ validations, model }) => {
      assert.deepEqual(model, object, 'expected model to be the correct model');
      assert.deepEqual(
        validations.content.mapBy('attribute').sort(),
        ['firstName', 'lastName'].sort()
      );

      let firstName = validations.content.findBy('attribute', 'firstName');
      let lastName = validations.content.findBy('attribute', 'lastName');

      assert.true(firstName.isValid);
      assert.false(firstName.isValidating);
      assert.deepEqual(firstName.message, undefined);

      assert.false(lastName.isValid);
      assert.false(lastName.isValidating);
      assert.deepEqual(lastName.message, 'lastName should be present');

      assert.false(
        object.validations.isValid,
        'isValid was expected to be FALSE'
      );
      assert.false(
        object.validations.isValidating,
        'isValidating was expected to be FALSE'
      );
      assert.false(
        object.validations.isTruelyValid,
        'isTruelyValid was expected to be FALSE'
      );
      assert.true(
        object.validations.isTruelyInvalid,
        'isTruelyInvalid was expected to be TRUE'
      );

      assert.true(object.validations.attrs.firstName.isValid);
      assert.false(object.validations.attrs.firstName.isValidating);
      assert.deepEqual(object.validations.attrs.firstName.message, null);

      assert.false(object.validations.attrs.lastName.isValid);
      assert.false(object.validations.attrs.lastName.isValidating);
      assert.deepEqual(
        object.validations.attrs.lastName.message,
        'lastName should be present'
      );
    });
  });

  test('basic sync validation - API - #validationSync', function (assert) {
    let object = setupObject(this, Validations, {
      firstName: 'Stef',
    });

    let { validations, model } = object.validations.validateSync();

    assert.deepEqual(model, object, 'expected model to be the correct model');
    assert.deepEqual(
      validations.content.mapBy('attribute').sort(),
      ['firstName', 'lastName'].sort()
    );

    let firstName = validations.content.findBy('attribute', 'firstName');
    let lastName = validations.content.findBy('attribute', 'lastName');

    assert.true(firstName.isValid);
    assert.false(firstName.isValidating);
    assert.deepEqual(firstName.message, undefined);

    assert.false(lastName.isValid);
    assert.false(lastName.isValidating);
    assert.deepEqual(lastName.message, 'lastName should be present');

    assert.false(
      object.validations.isValid,
      'isValid was expected to be FALSE'
    );
    assert.false(
      object.validations.isValidating,
      'isValidating was expected to be FALSE'
    );
    assert.false(
      object.validations.isTruelyValid,
      'isTruelyValid was expected to be FALSE'
    );
    assert.true(
      object.validations.isTruelyInvalid,
      'isTruelyInvalid was expected to be TRUE'
    );

    assert.true(object.validations.attrs.firstName.isValid);
    assert.false(object.validations.attrs.firstName.isValidating);
    assert.deepEqual(object.validations.attrs.firstName.message, null);

    assert.false(object.validations.attrs.lastName.isValid);
    assert.false(object.validations.attrs.lastName.isValidating);
    assert.deepEqual(
      object.validations.attrs.lastName.message,
      'lastName should be present'
    );
  });

  test('basic sync validation returns null', function (assert) {
    let Validations = {
      firstName: validator('inline', { validate: () => null }),
    };
    let object = setupObject(this, Validations, {
      firstName: 'Offir',
    });

    assert.false(
      object.validations.isValid,
      'isValid was expected to be FALSE'
    );
    assert.false(
      object.validations.isValidating,
      'isValidating was expected to be FALSE'
    );
    assert.false(
      object.validations.isTruelyValid,
      'isTruelyValid was expected to be FALSE'
    );
    assert.true(
      object.validations.isTruelyInvalid,
      'isTruelyInvalid was expected to be TRUE'
    );

    assert.false(object.validations.attrs.firstName.isValid);
    assert.false(object.validations.attrs.firstName.isValidating);
    assert.deepEqual(object.validations.attrs.firstName.message, undefined);
  });

  test('shallow isAsync test', function (assert) {
    assert.expect(4);
    let Validations = {
      firstName: validator('inline', {
        validate() {
          return new EmberPromise((resolve) => {
            resolve(true);
          });
        },
      }),
    };

    let obj = setupObject(this, Validations);

    assert.true(obj.validations.attrs.firstName.isAsync);
    assert.true(obj.validations.attrs.firstName.isValidating);

    return obj.validate().then(({ model }) => {
      assert.true(model.validations.isValid);
      assert.false(model.validations.isValidating);
    });
  });

  test('default options', function (assert) {
    let Validations = {
      firstName: {
        description: 'Test field',
        validators: [
          validator('inline', { validate: Validators.presence }),
          validator('inline', { validate: () => false }),
        ],
      },
    };
    let object = setupObject(this, Validations, {
      firstName: '',
    });
    let rules = A(object.validations._validationRules.firstName);
    assert.false(rules.isAny('defaultOptions', undefined));
    assert.deepEqual(rules[0].defaultOptions.description, 'Test field');
  });

  test('global options', function (assert) {
    this.owner.register('validator:length', LengthValidator);

    @buildValidations(
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
    )
    class ObjClass {}

    const object = new ObjClass();
    Object.assign(object, this.owner.ownerInjection(), { firstName: '' });

    // Global options present in rules
    let rules = A(object.validations._validationRules.firstName);
    assert.false(rules.isAny('globalOptions', undefined));
    assert.deepEqual(rules[0].globalOptions.max, 10);

    assert.ok(object.validations.attrs.firstName.isInvalid);

    let v = object.validations._validators.firstName[0];
    assert.deepEqual(
      {
        message: v.options.message,
        description: v.options.description,
        min: v.options.min,
        max: v.options.max,
      },
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
    let Validations = {
      firstName: validator('inline', {
        validate(value) {
          return this.createErrorMessage('test', value);
        },
      }),
    };

    let object = setupObject(this, Validations);

    assert.false(object.validations.attrs.firstName.isValid);
    assert.false(object.validations.attrs.firstName.isValidating);
    assert.deepEqual(
      object.validations.attrs.firstName.message,
      'Test error message'
    );
  });

  test('null message object', function (assert) {
    this.owner.register('validator:messages', DefaultMessages);
    let Validations = {
      firstName: validator('presence', {
        presence: true,
        message: null,
      }),
    };

    let object = setupObject(this, Validations);

    assert.deepEqual(
      object.validations.attrs.firstName.message,
      "This field can't be blank"
    );
  });

  test('debounced validations', async function (assert) {
    assert.expect(11);
    let initSetup = true;
    let Validations = {
      firstName: validator('inline', { validate: Validators.presence }),
      lastName: validator('inline', {
        validate: Validators.presence,
        get debounce() {
          return initSetup ? 0 : 500; // Do not debounce on initial object creation
        },
      }),
    };
    let object = setupObject(this, Validations);

    assert.false(
      object.validations.isValid,
      'isValid was expected to be FALSE'
    );
    assert.false(
      object.validations.isValidating,
      'isValidating was expected to be TRUE'
    );
    assert.false(
      object.validations.isTruelyValid,
      'isTruelyValid was expected to be FALSE'
    );
    assert.true(
      object.validations.isTruelyInvalid,
      'isTruelyInvalid was expected to be TRUE'
    );

    assert.false(object.validations.attrs.lastName.isValid);
    assert.false(object.validations.attrs.lastName.isValidating);
    assert.deepEqual(
      object.validations.attrs.lastName.message,
      'lastName should be present'
    );

    initSetup = false;
    object.set('lastName', 'Golan');
    assert.true(object.validations.attrs.lastName.isValidating);

    await run.later(() => {
      assert.true(object.validations.attrs.lastName.isValid);
      assert.false(object.validations.attrs.lastName.isValidating);
      assert.deepEqual(object.validations.attrs.lastName.message, null);
    }, 505);
  });

  test('debounced validator should only be called once', async function (assert) {
    assert.expect(1);
    let count = 0;
    let Validations = {
      firstName: validator('inline', {
        validate: () => count++,
        debounce: 500,
      }),
    };

    let object = setupObject(this, Validations);

    object.set('firstName', 'O');
    object.validations.attrs.firstName.isValid;

    object.set('firstName', 'Off');
    object.validations.attrs.firstName.isValid;

    object.set('firstName', 'Offir');
    object.validations.attrs.firstName.isValid;

    await run.later(() => {
      assert.deepEqual(count, 1);
    }, 505);
  });

  test('debounced validations should cleanup on object destroy', function (assert) {
    assert.expect(10);
    let done = assert.async();
    let initSetup = true;

    let debouncedValidator = validator('inline', {
      get debounce() {
        return initSetup ? 0 : 500;
      },
      validate(value, options, model, attr) {
        model.set('foo', 'bar');
        return Validators.presence(value, options, model, attr);
      },
    });

    let Validations = {
      firstName: validator('inline', { validate: Validators.presence }),
      lastName: debouncedValidator,
      'details.url': debouncedValidator,
    };
    let object = setupObject(this, Validations, {
      details: {},
    });

    assert.false(
      object.validations.isValid,
      'isValid was expected to be FALSE'
    );
    assert.false(
      object.validations.isValidating,
      'isValidating was expected to be TRUE'
    );
    assert.false(
      object.validations.isTruelyValid,
      'isTruelyValid was expected to be FALSE'
    );
    assert.true(
      object.validations.isTruelyInvalid,
      'isTruelyInvalid was expected to be TRUE'
    );

    assert.false(object.validations.attrs.lastName.isValid);
    assert.false(object.validations.attrs.lastName.isValidating);
    assert.deepEqual(
      object.validations.attrs.lastName.message,
      'lastName should be present'
    );

    initSetup = false;
    object.setProperties({
      lastName: 'Golan',
      'details.url': 'github.com',
    });
    assert.true(object.validations.attrs.lastName.isValidating);
    assert.true(object.validations.attrs.details.url.isValidating);

    run.later(() => {
      try {
        object.destroy();
        assert.ok(true, 'Object destroy was clean');
      } catch (e) {
        /* noop */
      }
      run.later(() => {
        done();
      }, 400);
    }, 200);
  });

  test('disabled validations - simple', function (assert) {
    let Validations = {
      firstName: validator('inline', { validate: Validators.presence }),
      lastName: validator('inline', {
        validate: Validators.presence,
        disabled: true,
      }),
    };
    let object = setupObject(this, Validations);

    assert.false(
      object.validations.isValid,
      'isValid was expected to be FALSE'
    );
    assert.false(
      object.validations.isValidating,
      'isValidating was expected to be TRUE'
    );
    assert.false(
      object.validations.isTruelyValid,
      'isTruelyValid was expected to be FALSE'
    );
    assert.true(
      object.validations.isTruelyInvalid,
      'isTruelyInvalid was expected to be TRUE'
    );

    assert.true(object.validations.attrs.lastName.isValid);
    assert.false(object.validations.attrs.firstName.isValid);

    object.set('firstName', 'Offir');

    assert.true(object.validations.isValid);
  });

  test('disabled validations - cp with dependent key', function (assert) {
    let Validations = {
      firstName: validator('inline', { validate: Validators.presence }),
      lastName: validator('inline', {
        validate: Validators.presence,
        get disabled() {
          return !this.model.validateLastName;
        },
      }),
    };
    let object = setupObject(this, Validations, {
      firstName: 'Offir',
      validateLastName: true,
    });

    assert.false(
      object.validations.isValid,
      'isValid was expected to be FALSE'
    );
    assert.false(
      object.validations.isValidating,
      'isValidating was expected to be TRUE'
    );
    assert.false(
      object.validations.isTruelyValid,
      'isTruelyValid was expected to be FALSE'
    );
    assert.true(
      object.validations.isTruelyInvalid,
      'isTruelyInvalid was expected to be TRUE'
    );

    assert.false(object.validations.attrs.lastName.isValid);
    assert.true(object.validations.attrs.firstName.isValid);

    object.set('validateLastName', false);

    assert.true(object.validations.attrs.lastName.isValid);
    assert.true(object.validations.isValid);
  });

  test('attribute validation result options hash', function (assert) {
    this.owner.register('validator:length', LengthValidator);
    this.owner.register('validator:presence', PresenceValidator);

    let Validations = {
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
    };
    let object = setupObject(this, Validations, { max: 5 });
    let options = object.validations.attrs.firstName.options;

    assert.ok(options);
    assert.deepEqual(
      Object.keys(options).sort(),
      ['presence', 'length', 'inline'].sort()
    );
    assert.ok(isArray(options.inline));
    assert.strictEqual(options.inline.length, 2);
    assert.ok(options.presence.presence);
    assert.deepEqual(options.length.min, 1);
    assert.ok(options['inline'][1].presence);

    // Default options built into option objects
    assert.deepEqual(options.length.description, 'First Name');
    assert.deepEqual(options.presence.description, 'First Name');
    assert.deepEqual(options['inline'][0].description, 'First Name');
  });

  test('attribute validation result options hash with cps', function (assert) {
    this.owner.register('validator:length', LengthValidator);

    let Validations = {
      firstName: {
        validators: [
          validator('length', {
            min: 1,
            get max() {
              return this.model.max;
            },
          }),
        ],
      },
    };
    let object = setupObject(this, Validations, { max: 5 });
    let options = object.validations.attrs.firstName.options;
    assert.deepEqual(options.length.max, 5);

    run(() => object.set('max', 3));

    options = object.validations.attrs.firstName.options;
    assert.deepEqual(options.length.max, 3);
  });

  test('validations persist with inheritance', function (assert) {
    @buildValidations({
      firstName: validator('inline', { validate: Validators.presence }),
      lastName: validator('inline', { validate: Validators.presence }),
    })
    class Parent {}

    @buildValidations({
      middleName: validator('inline', { validate: Validators.presence }),
      dob: validator('inline', { validate: Validators.presence }),
    })
    class Child extends Parent {}

    const child = new Child();
    Object.assign(child, this.owner.ownerInjection());

    child.validateSync();

    assert.deepEqual(child.validations.errors.length, 4);
    assert.false(child.validations.isValid);
    assert.deepEqual(
      child.validations.validatableAttributes.sort(),
      ['firstName', 'lastName', 'middleName', 'dob'].sort()
    );

    child.setProperties({
      middleName: 'John',
      dob: '10/22/16',
    });

    assert.deepEqual(child.validations.errors.length, 2);

    child.setProperties({
      firstName: 'Joe',
      lastName: 'Jenkins',
    });

    assert.true(child.validations.isValid);
    assert.deepEqual(child.validations.errors.length, 0);
  });

  test('validations persist with deep inheritance', function (assert) {
    @buildValidations({
      firstName: validator('inline', { validate: Validators.presence }),
      lastName: validator('inline', { validate: Validators.presence }),
    })
    class Parent {}

    @buildValidations({
      middleName: validator('inline', { validate: Validators.presence }),
      dob: validator('inline', { validate: Validators.presence }),
    })
    class Child extends Parent {}

    @buildValidations({
      diaper: validator('inline', { validate: Validators.presence }),
      favParent: validator('inline', { validate: Validators.presence }),
    })
    class Baby extends Child {}

    const baby = new Baby();
    Object.assign(baby, this.owner.ownerInjection());

    baby.validateSync();

    assert.deepEqual(baby.validations.errors.length, 6);
    assert.false(baby.validations.isValid);
    assert.deepEqual(
      baby.validations.validatableAttributes.sort(),
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

    assert.deepEqual(baby.validations.errors.length, 4);

    baby.setProperties({
      firstName: 'Joe',
      lastName: 'Jenkins',
    });

    assert.deepEqual(baby.validations.errors.length, 2);

    baby.setProperties({
      diaper: 'soiled',
      favParent: 'mom',
    });

    assert.true(baby.validations.isValid);
    assert.deepEqual(baby.validations.errors.length, 0);
  });

  test('validateAttribute - sync validations', function (assert) {
    assert.expect(4);
    let Validations = {
      firstName: [
        validator('inline', { validate: Validators.presence }),
        validator('inline', { validate: () => true }),
      ],
    };
    let object = setupObject(this, Validations, {
      firstName: 'Offir',
    });

    return object
      .validateAttribute('firstName', undefined)
      .then(({ validations, model }) => {
        assert.true(model.validations.isValid);
        assert.false(validations.isValid);
        assert.false(validations.isValidating);
        assert.deepEqual(validations.message, 'firstName should be present');
      });
  });

  test('validateAttribute - async validations', function (assert) {
    assert.expect(3);
    let Validations = {
      firstName: [
        validator('inline', {
          validate: () => EmberPromise.resolve('firstName is invalid'),
        }),
        validator('inline', {
          validate: () => EmberPromise.resolve('firstName is really invalid'),
        }),
      ],
    };
    let object = setupObject(this, Validations, {
      firstName: 'Offir',
    });

    return object
      .validateAttribute('firstName', 'foo')
      .then(({ validations }) => {
        assert.false(validations.isValid);
        assert.false(validations.isValidating);
        assert.deepEqual(validations.message, 'firstName is invalid');
      });
  });

  test('warning validators api', function (assert) {
    this.owner.register('validator:length', LengthValidator);
    this.owner.register('validator:presence', PresenceValidator);

    let Validations = {
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
    };

    let object = setupObject(this, Validations, {
      password: '',
    });

    assert.false(object.validations.isValid);
    assert.deepEqual(object.validations.warnings.length, 2);
    assert.deepEqual(
      object.validations.warningMessage,
      'Password should not be empty'
    );
    assert.deepEqual(
      object.validations.message,
      'Password is too short (minimum is 1 characters)'
    );

    assert.false(object.validations.attrs.password.isValid);
    assert.deepEqual(object.validations.attrs.password.warnings.length, 2);
    assert.deepEqual(
      object.validations.attrs.password.warningMessage,
      'Password should not be empty'
    );
    assert.deepEqual(
      object.validations.attrs.password.message,
      'Password is too short (minimum is 1 characters)'
    );

    object.set('password', 'wat');

    assert.true(object.validations.isValid);
    assert.true(object.validations.attrs.password.isValid);
    assert.deepEqual(object.validations.attrs.password.warnings.length, 1);
    assert.deepEqual(
      object.validations.attrs.password.warningMessage,
      'Password is weak'
    );
  });

  test('computed isWarning option', function (assert) {
    this.owner.register('validator:length', LengthValidator);
    this.owner.register('validator:presence', PresenceValidator);

    let Validations = {
      password: {
        description: 'Password',
        lazy: false,
        validators: [
          validator('presence', {
            presence: true,
            message: '{description} should not be empty',
            get isWarning() {
              return this.model.isWarning;
            },
          }),
          validator('length', {
            min: 1,
            max: 10,
          }),
        ],
      },
    };

    let object = setupObject(this, Validations, {
      password: '',
      isWarning: false,
    });

    assert.false(object.validations.isValid);
    assert.deepEqual(object.validations.warnings.length, 0);
    assert.deepEqual(object.validations.errors.length, 2);

    object.set('isWarning', true);

    assert.deepEqual(object.validations.warnings.length, 1);
    assert.deepEqual(object.validations.errors.length, 1);
  });

  test('options CP changes trigger attribute revalidation', function (assert) {
    this.owner.register('validator:length', LengthValidator);

    @buildValidations(
      {
        firstName: {
          get description() {
            return this.model.description;
          },
          validators: [
            validator('length', {
              get min() {
                return this.model.minLength;
              },
              set min(val) {
                this.model.minLength = val;
              },
            }),
          ],
        },
      },
      {
        get disabled() {
          return !this.model.enabled;
        },
      }
    )
    class ObjClass {}

    let object = new ObjClass();

    Object.assign(object, this.owner.ownerInjection(), {
      enabled: true,
      description: 'First Name',
      minLength: 6,
      firstName: 'Offir',
    });

    assert.false(
      object.validations.isValid,
      'isValid was expected to be FALSE'
    );
    assert.false(
      object.validations.isValidating,
      'isValidating was expected to be FALSE'
    );
    assert.false(
      object.validations.isTruelyValid,
      'isTruelyValid was expected to be FALSE'
    );
    assert.true(
      object.validations.isTruelyInvalid,
      'isTruelyInvalid was expected to be TRUE'
    );

    assert.false(object.validations.attrs.firstName.isValid);
    assert.deepEqual(
      object.validations.attrs.firstName.message,
      'First Name is too short (minimum is 6 characters)'
    );

    object.setProperties({
      description: 'Name',
      minLength: 10,
    });

    assert.false(object.validations.attrs.firstName.isValid);
    assert.deepEqual(
      object.validations.attrs.firstName.message,
      'Name is too short (minimum is 10 characters)'
    );

    object.set('enabled', false);

    assert.true(object.validations.attrs.firstName.isValid);
    assert.true(object.validations.isValid, 'isValid was expected to be FALSE');
  });

  test('lazy validators are actually lazy', function (assert) {
    this.owner.register('validator:length', LengthValidator);
    this.owner.register('validator:presence', PresenceValidator);

    let customValidatorCount = 0;

    let Validations = {
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
    };

    let object = setupObject(this, Validations);

    assert.false(object.validations.attrs.password.isValid);
    assert.deepEqual(
      object.validations.attrs.password.messages.length,
      1,
      'Only 1 error message should be present'
    );
    assert.deepEqual(
      object.validations.attrs.password.message,
      "Password can't be blank"
    );

    object.set('password', '1234');

    assert.false(object.validations.attrs.password.isValid);
    assert.deepEqual(
      object.validations.attrs.password.messages.length,
      1,
      'Only 1 error message should be present'
    );
    assert.deepEqual(
      object.validations.attrs.password.message,
      'Password is too short (minimum is 5 characters)'
    );

    object.set('password', '12345');

    assert.false(object.validations.attrs.password.isValid);
    assert.deepEqual(
      object.validations.attrs.password.messages.length,
      1,
      'Only 1 error message should be present'
    );
    assert.deepEqual(
      object.validations.attrs.password.message,
      'Password is not valid'
    );
    assert.deepEqual(
      customValidatorCount,
      1,
      'Last validator only executed once'
    );
  });

  test('none lazy validators are actually not lazy', function (assert) {
    this.owner.register('validator:length', LengthValidator);
    this.owner.register('validator:presence', PresenceValidator);

    let customValidatorCount = 0;

    let Validations = {
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
    };

    let object = setupObject(this, Validations);

    assert.false(object.validations.attrs.password.isValid);
    assert.deepEqual(
      object.validations.attrs.password.messages.length,
      2,
      'Only 2 error message should be present'
    );
    assert.deepEqual(
      object.validations.attrs.password.message,
      "Password can't be blank"
    );

    object.set('password', '1234');

    assert.false(object.validations.attrs.password.isValid);
    assert.deepEqual(
      object.validations.attrs.password.messages.length,
      2,
      'Only 2 error message should be present'
    );
    assert.deepEqual(
      object.validations.attrs.password.message,
      'Password is too short (minimum is 5 characters)'
    );

    object.set('password', '12345');

    assert.false(object.validations.attrs.password.isValid);
    assert.deepEqual(
      object.validations.attrs.password.messages.length,
      1,
      'Only 1 error message should be present'
    );
    assert.deepEqual(
      object.validations.attrs.password.message,
      'Password is not valid'
    );
    assert.deepEqual(
      customValidatorCount,
      3,
      'Last validator executed 3 times'
    );
  });

  test('validator should return correct error type', function (assert) {
    this.owner.register('validator:presence', PresenceValidator);
    this.owner.register('validator:length', LengthValidator);

    let Validations = {
      firstName: [
        validator('presence', true),
        validator('length', { min: 5, max: 35 }),
      ],
      lastName: [
        validator('presence', true),
        validator('length', { min: 5, max: 35 }),
      ],
    };

    let obj = setupObject(this, Validations, {
      firstName: 'Foo',
      lastName: null,
    });

    assert.false(
      obj.validations.attrs.firstName.isValid,
      'isValid was expected to be FALSE'
    );
    assert.deepEqual(
      obj.validations.attrs.lastName.error.type,
      'presence',
      'error type was expected to be `presence`'
    );
    assert.deepEqual(
      obj.validations.errors.length,
      2,
      'number of errors was expected to be 2'
    );
    assert.deepEqual(
      obj.validations.errors.filterBy('type', 'presence').length,
      1,
      'number of errors was expected to be 1'
    );
  });

  test('load test', function (assert) {
    this.owner.register('validator:presence', PresenceValidator);

    let Validations = {
      a: validator('presence', true),
      b: validator('presence', true),
      c: validator('presence', true),
      d: validator('presence', true),
      e: validator('presence', true),
    };

    let items = A([]);
    for (let i = 0; i < 50; i++) {
      let obj = setupObject(this, Validations, {
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
