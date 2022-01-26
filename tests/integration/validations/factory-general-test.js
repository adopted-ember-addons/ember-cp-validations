import { A, isArray } from '@ember/array';
import { isNone } from '@ember/utils';
import { run } from '@ember/runloop';
import DefaultMessages from 'dummy/validators/messages';
import PresenceValidator from 'dummy/validators/presence';
import LengthValidator from 'dummy/validators/length';
import { validator, buildValidations } from 'ember-cp-validations';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { tracked } from '@glimmer/tracking';

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

class ObjClassBase {
  @tracked firstName;
  @tracked lastName;
  @tracked password;

  constructor(owner, props = {}) {
    Object.assign(this, owner.ownerInjection(), props);
  }
}

@buildValidations(Validations)
class ObjClass extends ObjClassBase {}

module('Integration | Validations | Factory - General', function (hooks) {
  setupTest(hooks);

  test('basic sync validation – invalid', function (assert) {
    let object = new ObjClass(this.owner);

    assert.false(
      object.validations.isValid,
      'isValid was expected to be FALSE'
    );

    assert.false(object.validations.attrs.firstName.isValid);
    assert.deepEqual(
      object.validations.attrs.firstName.message,
      'firstName should be present'
    );

    assert.false(object.validations.attrs.lastName.isValid);
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
      object.validations.attrs.lastName.errors[0].message
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
    assert.true(object.validations.attrs.firstName.isValid);
    assert.deepEqual(object.validations.attrs.firstName.message, undefined);

    assert.true(object.validations.attrs.lastName.isValid);
    assert.deepEqual(object.validations.attrs.lastName.message, undefined);

    assert.deepEqual(
      object.validations.errors.length,
      0,
      'errors length was expected to be 0'
    );
  });

  test('basic sync validation - valid', function (assert) {
    let object = new ObjClass(this.owner, {
      firstName: 'Stef',
      lastName: 'Penner',
    });

    assert.true(object.validations.isValid, 'isValid was expected to be TRUE');
    assert.true(object.validations.attrs.firstName.isValid);
    assert.deepEqual(object.validations.attrs.firstName.message, undefined);

    assert.true(object.validations.attrs.lastName.isValid);
    assert.deepEqual(object.validations.attrs.lastName.message, undefined);
  });

  test('basic sync validation - 50% invalid', function (assert) {
    let object = new ObjClass(this.owner, {
      firstName: 'Stef',
    });

    assert.false(
      object.validations.isValid,
      'isValid was expected to be FALSE'
    );

    assert.true(object.validations.attrs.firstName.isValid);
    assert.deepEqual(object.validations.attrs.firstName.message, undefined);

    assert.false(object.validations.attrs.lastName.isValid);
    assert.deepEqual(
      object.validations.attrs.lastName.message,
      'lastName should be present'
    );
  });

  test('basic sync validation - API - #validation', function (assert) {
    assert.expect(11);
    let object = new ObjClass(this.owner, {
      firstName: 'Stef',
    });

    const { validations, model } = object.validations.validate();
    assert.deepEqual(model, object, 'expected model to be the correct model');
    assert.deepEqual(
      validations.content.mapBy('attribute').sort(),
      ['firstName', 'lastName'].sort()
    );

    let firstName = validations.content.findBy('attribute', 'firstName');
    let lastName = validations.content.findBy('attribute', 'lastName');

    assert.true(firstName.isValid);
    assert.deepEqual(firstName.message, undefined);

    assert.false(lastName.isValid);
    assert.deepEqual(lastName.message, 'lastName should be present');

    assert.false(
      object.validations.isValid,
      'isValid was expected to be FALSE'
    );

    assert.true(object.validations.attrs.firstName.isValid);
    assert.deepEqual(object.validations.attrs.firstName.message, undefined);

    assert.false(object.validations.attrs.lastName.isValid);
    assert.deepEqual(
      object.validations.attrs.lastName.message,
      'lastName should be present'
    );
  });

  test('basic sync validation - API - #validationSync', function (assert) {
    let object = new ObjClass(this.owner, {
      firstName: 'Stef',
    });

    let { validations, model } = object.validations.validate();

    assert.deepEqual(model, object, 'expected model to be the correct model');
    assert.deepEqual(
      validations.content.mapBy('attribute').sort(),
      ['firstName', 'lastName'].sort()
    );

    let firstName = validations.content.findBy('attribute', 'firstName');
    let lastName = validations.content.findBy('attribute', 'lastName');

    assert.true(firstName.isValid);
    assert.deepEqual(firstName.message, undefined);

    assert.false(lastName.isValid);
    assert.deepEqual(lastName.message, 'lastName should be present');

    assert.false(
      object.validations.isValid,
      'isValid was expected to be FALSE'
    );

    assert.true(object.validations.attrs.firstName.isValid);
    assert.deepEqual(object.validations.attrs.firstName.message, undefined);

    assert.false(object.validations.attrs.lastName.isValid);
    assert.deepEqual(
      object.validations.attrs.lastName.message,
      'lastName should be present'
    );
  });

  test('basic sync validation returns null', function (assert) {
    @buildValidations({
      firstName: validator('inline', { validate: () => null }),
    })
    class ObjClass extends ObjClassBase {}

    let object = new ObjClass(this.owner, {
      firstName: 'Offir',
    });

    assert.false(
      object.validations.isValid,
      'isValid was expected to be FALSE'
    );

    assert.false(object.validations.attrs.firstName.isValid);
    assert.deepEqual(object.validations.attrs.firstName.message, undefined);
  });

  test('default options', function (assert) {
    @buildValidations({
      firstName: {
        description: 'Test field',
        validators: [
          validator('inline', { validate: Validators.presence }),
          validator('inline', { validate: () => false }),
        ],
      },
    })
    class ObjClass extends ObjClassBase {}

    let object = new ObjClass(this.owner, {
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
    class ObjClass extends ObjClassBase {}

    const object = new ObjClass(this.owner, { firstName: '' });

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

    @buildValidations({
      firstName: validator('inline', {
        validate(value) {
          return this.createErrorMessage('test', value);
        },
      }),
    })
    class ObjClass extends ObjClassBase {}

    let object = new ObjClass(this.owner);

    assert.false(object.validations.attrs.firstName.isValid);
    assert.deepEqual(
      object.validations.attrs.firstName.message,
      'Test error message'
    );
  });

  test('null message object', function (assert) {
    this.owner.register('validator:messages', DefaultMessages);
    @buildValidations({
      firstName: validator('presence', {
        presence: true,
        message: null,
      }),
    })
    class ObjClass extends ObjClassBase {}

    const object = new ObjClass(this.owner);

    assert.deepEqual(
      object.validations.attrs.firstName.message,
      "This field can't be blank"
    );
  });

  test('disabled validations - simple', function (assert) {
    @buildValidations({
      firstName: validator('inline', { validate: Validators.presence }),
      lastName: validator('inline', {
        validate: Validators.presence,
        disabled: true,
      }),
    })
    class ObjClass extends ObjClassBase {}

    const object = new ObjClass(this.owner);

    assert.false(
      object.validations.isValid,
      'isValid was expected to be FALSE'
    );

    assert.true(object.validations.attrs.lastName.isValid);
    assert.false(object.validations.attrs.firstName.isValid);

    object.firstName = 'Offir';

    assert.true(object.validations.isValid);
  });

  test('disabled validations - cp with dependent key', function (assert) {
    @buildValidations({
      firstName: validator('inline', { validate: Validators.presence }),
      lastName: validator('inline', {
        validate: Validators.presence,
        get disabled() {
          return !this.model.validateLastName;
        },
      }),
    })
    class ObjClass extends ObjClassBase {
      @tracked validateLastName;
    }

    let object = new ObjClass(this.owner, {
      firstName: 'Offir',
      validateLastName: true,
    });

    assert.false(
      object.validations.isValid,
      'isValid was expected to be FALSE'
    );

    assert.false(object.validations.attrs.lastName.isValid);
    assert.true(object.validations.attrs.firstName.isValid);

    object.validateLastName = false;

    assert.true(object.validations.attrs.lastName.isValid);
    assert.true(object.validations.isValid);
  });

  test('attribute validation result options hash', function (assert) {
    this.owner.register('validator:length', LengthValidator);
    this.owner.register('validator:presence', PresenceValidator);

    @buildValidations({
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
    })
    class ObjClass extends ObjClassBase {}

    let object = new ObjClass(this.owner, { max: 5 });
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

    @buildValidations({
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
    })
    class ObjClass extends ObjClassBase {}

    let object = new ObjClass(this.owner, { max: 5 });
    let options = object.validations.attrs.firstName.options;
    assert.deepEqual(options.length.max, 5);

    run(() => (object.max = 3));

    options = object.validations.attrs.firstName.options;
    assert.deepEqual(options.length.max, 3);
  });

  test('validations persist with inheritance', function (assert) {
    @buildValidations({
      firstName: validator('inline', { validate: Validators.presence }),
      lastName: validator('inline', { validate: Validators.presence }),
    })
    class Parent {
      @tracked firstName;
      @tracked lastName;
      get herp() {
        return 'a';
      }

      constructor(owner, props = {}) {
        Object.assign(this, owner.ownerInjection(), props);
      }
    }

    @buildValidations({
      middleName: validator('inline', { validate: Validators.presence }),
      dob: validator('inline', { validate: Validators.presence }),
    })
    class Child extends Parent {
      @tracked middleName;
      @tracked dob;

      get herp() {
        return 'b';
      }
    }

    const child = new Child(this.owner);

    child.validate();

    assert.deepEqual(child.validations.errors.length, 4);
    assert.false(child.validations.isValid);
    assert.deepEqual(
      child.validations.validatableAttributes.sort(),
      ['firstName', 'lastName', 'middleName', 'dob'].sort()
    );

    Object.assign(child, {
      middleName: 'John',
      dob: '10/22/16',
    });

    assert.deepEqual(child.validations.errors.length, 2);

    Object.assign(child, {
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
    class Parent extends ObjClassBase {}

    @buildValidations({
      middleName: validator('inline', { validate: Validators.presence }),
      dob: validator('inline', { validate: Validators.presence }),
    })
    class Child extends Parent {
      @tracked middleName;
      @tracked dob;
    }

    @buildValidations({
      diaper: validator('inline', { validate: Validators.presence }),
      favParent: validator('inline', { validate: Validators.presence }),
    })
    class Baby extends Child {
      @tracked diaper;
      @tracked favParent;
    }

    const baby = new Baby(this.owner);

    baby.validate();

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

    Object.assign(this, {
      middleName: 'John',
      dob: '10/22/16',
    });

    assert.deepEqual(baby.validations.errors.length, 4);

    Object.assign(this, {
      firstName: 'Joe',
      lastName: 'Jenkins',
    });

    assert.deepEqual(baby.validations.errors.length, 2);

    Object.assign(this, {
      diaper: 'soiled',
      favParent: 'mom',
    });

    assert.true(baby.validations.isValid);
    assert.deepEqual(baby.validations.errors.length, 0);
  });

  test('validateAttribute - sync validations', function (assert) {
    assert.expect(3);

    @buildValidations({
      firstName: [
        validator('inline', { validate: Validators.presence }),
        validator('inline', { validate: () => true }),
      ],
    })
    class ObjClass extends ObjClassBase {}

    let object = new ObjClass(this.owner, {
      firstName: 'Offir',
    });

    const { validations, model } = object.validateAttribute(
      'firstName',
      undefined
    );

    assert.true(model.validations.isValid);
    assert.false(validations.isValid);
    assert.deepEqual(validations.message, 'firstName should be present');
  });

  test('warning validators api', function (assert) {
    this.owner.register('validator:length', LengthValidator);
    this.owner.register('validator:presence', PresenceValidator);

    @buildValidations({
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
    })
    class ObjClass extends ObjClassBase {}

    let object = new ObjClass(this.owner, {
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

    object.password = 'wat';

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

    @buildValidations({
      password: {
        description: 'Password',
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
    })
    class ObjClass extends ObjClassBase {
      @tracked isWarning = false;
    }

    const object = new ObjClass(this.owner);

    assert.false(object.validations.isValid);
    assert.deepEqual(object.validations.warnings.length, 0);
    assert.deepEqual(object.validations.errors.length, 2);

    object.isWarning = true;

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
    class ObjClass extends ObjClassBase {
      @tracked enabled;
      @tracked description;
      @tracked minLength;
    }

    const object = new ObjClass(this.owner, {
      enabled: true,
      description: 'First Name',
      minLength: 6,
      firstName: 'Offir',
    });

    assert.false(
      object.validations.isValid,
      'isValid was expected to be FALSE'
    );

    assert.false(object.validations.attrs.firstName.isValid);
    assert.deepEqual(
      object.validations.attrs.firstName.message,
      'First Name is too short (minimum is 6 characters)'
    );

    Object.assign(object, {
      description: 'Name',
      minLength: 10,
    });

    assert.false(object.validations.attrs.firstName.isValid);
    assert.deepEqual(
      object.validations.attrs.firstName.message,
      'Name is too short (minimum is 10 characters)'
    );

    object.enabled = false;

    assert.true(object.validations.attrs.firstName.isValid);
    assert.true(object.validations.isValid, 'isValid was expected to be FALSE');
  });

  test('validators are lazy', function (assert) {
    this.owner.register('validator:length', LengthValidator);
    this.owner.register('validator:presence', PresenceValidator);

    let customValidatorCount = 0;

    @buildValidations({
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
    })
    class ObjClass extends ObjClassBase {}

    let object = new ObjClass(this.owner);

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

    object.password = '1234';

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

    object.password = '12345';

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

  test('validator should return correct error type', function (assert) {
    this.owner.register('validator:presence', PresenceValidator);
    this.owner.register('validator:length', LengthValidator);

    @buildValidations({
      firstName: [
        validator('presence', true),
        validator('length', { min: 5, max: 35 }),
      ],
      lastName: [
        validator('presence', true),
        validator('length', { min: 5, max: 35 }),
      ],
    })
    class ObjClass extends ObjClassBase {}

    let obj = new ObjClass(this.owner, {
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

    @buildValidations({
      a: validator('presence', true),
      b: validator('presence', true),
      c: validator('presence', true),
      d: validator('presence', true),
      e: validator('presence', true),
    })
    class ObjClass {
      @tracked a;
      @tracked b;
      @tracked c;
      @tracked d;
      @tracked e;

      constructor(owner, props = {}) {
        Object.assign(this, owner.ownerInjection(), props);
      }
    }

    let items = A([]);
    for (let i = 0; i < 50; i++) {
      items.push(
        new ObjClass(this.owner, {
          a: i,
          b: i,
          c: i,
          d: i,
          e: i,
        })
      );
    }
    /* eslint-disable no-console */
    console.time('init');
    items.mapBy('validations.isValid');
    console.timeEnd('init');

    items.forEach((item, i) => {
      Object.assign(item, {
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
