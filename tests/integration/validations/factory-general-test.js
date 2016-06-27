import Ember from 'ember';
import setupObject from '../../helpers/setup-object';
import DefaultMessages from 'dummy/validators/messages';
import PresenceValidator from 'dummy/validators/presence';
import LengthValidator from 'dummy/validators/length';
import { validator, buildValidations } from 'ember-cp-validations';
import { moduleFor, test } from 'ember-qunit';

const {
  run
} = Ember;

const Validators = {
  presence(value, options, model, attr) {
    var isValid = !Ember.isNone(value);
    if (Ember.isNone(value)) {
      return `${attr} should be present`;
    }
    return true;
  }
};

var Validations = buildValidations({
  firstName: validator(Validators.presence),
  lastName: validator(Validators.presence)
});

moduleFor('foo', 'Integration | Validations | Factory - General', {
  integration: true,
});

test("it works", function(assert) {
  assert.ok(buildValidations());
});

test("basic sync validation – invalid", function(assert) {
  var object = setupObject(this, Ember.Object.extend(Validations));

  assert.equal(object.get('validations.isValid'), false, 'isValid was expected to be FALSE');
  assert.equal(object.get('validations.isValidating'), false, 'isValidating was expected to be FALSE');
  assert.equal(object.get('validations.isTruelyValid'), false, 'isTruelyValid was expected to be FALSE');

  assert.equal(object.get('validations.attrs.firstName.isValid'), false);
  assert.equal(object.get('validations.attrs.firstName.isValidating'), false);
  assert.equal(object.get('validations.attrs.firstName.message'), 'firstName should be present');

  assert.equal(object.get('validations.attrs.lastName.isValid'), false);
  assert.equal(object.get('validations.attrs.lastName.isValidating'), false);
  assert.equal(object.get('validations.attrs.lastName.message'), 'lastName should be present');

  assert.equal(object.get('validations.errors.length'), 2, 'errors length was expected to be 2');
  assert.ok(object.get('validations.errors').indexOf(object.get('validations.attrs.firstName.errors.0')) > -1, 'errors was expected to contain firstName error');
  assert.ok(object.get('validations.errors').indexOf(object.get('validations.attrs.lastName.errors.0')) > -1, 'errors was expected to contain lastName error');
  assert.equal(object.get('validations.errors.0.attribute'), 'firstName', 'error object was expected to have attribute "firstName"');
  assert.equal(object.get('validations.errors.1.attribute'), 'lastName', 'error object was expected to have attribute "lastName"');

  object.set('firstName', 'stef');
  object.set('lastName', 'penner');

  assert.equal(object.get('validations.isValid'), true, 'isValid was expected to be TRUE');
  assert.equal(object.get('validations.isValidating'), false, 'isValidating was expected to be TRUE');
  assert.equal(object.get('validations.isTruelyValid'), true, 'isTruelyValid was expected to be TRUE');

  assert.equal(object.get('validations.attrs.firstName.isValid'), true);
  assert.equal(object.get('validations.attrs.firstName.isValidating'), false);
  assert.equal(object.get('validations.attrs.firstName.message'), null);

  assert.equal(object.get('validations.attrs.lastName.isValid'), true);
  assert.equal(object.get('validations.attrs.lastName.isValidating'), false);
  assert.equal(object.get('validations.attrs.lastName.message'), null);

  assert.equal(object.get('validations.errors.length'), 0, 'errors length was expected to be 0');
});

test("basic sync validation - valid", function(assert) {
  var object = setupObject(this, Ember.Object.extend(Validations), {
    firstName: 'Stef',
    lastName: 'Penner'
  });

  assert.equal(object.get('validations.isValid'), true, 'isValid was expected to be TRUE');
  assert.equal(object.get('validations.isValidating'), false, 'isValidating was expected to be FALSE');
  assert.equal(object.get('validations.isTruelyValid'), true, 'isTruelyValid was expected to be TRUE');

  assert.equal(object.get('validations.attrs.firstName.isValid'), true);
  assert.equal(object.get('validations.attrs.firstName.isValidating'), false);
  assert.equal(object.get('validations.attrs.firstName.message'), null);

  assert.equal(object.get('validations.attrs.lastName.isValid'), true);
  assert.equal(object.get('validations.attrs.lastName.isValidating'), false);
  assert.equal(object.get('validations.attrs.lastName.message'), null);
});

test("basic sync validation - 50% invalid", function(assert) {
  var object = setupObject(this, Ember.Object.extend(Validations), {
    firstName: 'Stef'
  });

  assert.equal(object.get('validations.isValid'), false, 'isValid was expected to be FALSE');
  assert.equal(object.get('validations.isValidating'), false, 'isValidating was expected to be FALSE');
  assert.equal(object.get('validations.isTruelyValid'), false, 'isTruelyValid was expected to be FALSE');

  assert.equal(object.get('validations.attrs.firstName.isValid'), true);
  assert.equal(object.get('validations.attrs.firstName.isValidating'), false);
  assert.equal(object.get('validations.attrs.firstName.message'), null);

  assert.equal(object.get('validations.attrs.lastName.isValid'), false);
  assert.equal(object.get('validations.attrs.lastName.isValidating'), false);
  assert.equal(object.get('validations.attrs.lastName.message'), 'lastName should be present');
});

test("basic sync validation - API - #validation", function(assert) {
  var object = setupObject(this, Ember.Object.extend(Validations), {
    firstName: 'Stef'
  });

  return object.get('validations').validate().then(({
    validations, model
  }) => {
    assert.equal(model, object, 'expected model to be the correct model');
    assert.deepEqual(validations.get('content').getEach('attribute').sort(), ['firstName', 'lastName'].sort());

    let firstName = validations.get('content').findBy('attribute', 'firstName');
    let lastName = validations.get('content').findBy('attribute', 'lastName');

    assert.equal(firstName.get('isValid'), true);
    assert.equal(firstName.get('isValidating'), false);
    assert.equal(firstName.get('message'), undefined);

    assert.equal(lastName.get('isValid'), false);
    assert.equal(lastName.get('isValidating'), false);
    assert.equal(lastName.get('message'), 'lastName should be present');

    assert.equal(object.get('validations.isValid'), false, 'isValid was expected to be FALSE');
    assert.equal(object.get('validations.isValidating'), false, 'isValidating was expected to be FALSE');
    assert.equal(object.get('validations.isTruelyValid'), false, 'isTruelyValid was expected to be FALSE');

    assert.equal(object.get('validations.attrs.firstName.isValid'), true);
    assert.equal(object.get('validations.attrs.firstName.isValidating'), false);
    assert.equal(object.get('validations.attrs.firstName.message'), null);

    assert.equal(object.get('validations.attrs.lastName.isValid'), false);
    assert.equal(object.get('validations.attrs.lastName.isValidating'), false);
    assert.equal(object.get('validations.attrs.lastName.message'), 'lastName should be present');
  });
});

test("basic sync validation - API - #validationSync", function(assert) {
  var object = setupObject(this, Ember.Object.extend(Validations), {
    firstName: 'Stef'
  });

  const {
    validations,
    model
  } = object.get('validations').validateSync();

  assert.equal(model, object, 'expected model to be the correct model');
  assert.deepEqual(validations.get('content').getEach('attribute').sort(), ['firstName', 'lastName'].sort());

  let firstName = validations.get('content').findBy('attribute', 'firstName');
  let lastName = validations.get('content').findBy('attribute', 'lastName');

  assert.equal(firstName.get('isValid'), true);
  assert.equal(firstName.get('isValidating'), false);
  assert.equal(firstName.get('message'), undefined);

  assert.equal(lastName.get('isValid'), false);
  assert.equal(lastName.get('isValidating'), false);
  assert.equal(lastName.get('message'), 'lastName should be present');

  assert.equal(object.get('validations.isValid'), false, 'isValid was expected to be FALSE');
  assert.equal(object.get('validations.isValidating'), false, 'isValidating was expected to be FALSE');
  assert.equal(object.get('validations.isTruelyValid'), false, 'isTruelyValid was expected to be FALSE');

  assert.equal(object.get('validations.attrs.firstName.isValid'), true);
  assert.equal(object.get('validations.attrs.firstName.isValidating'), false);
  assert.equal(object.get('validations.attrs.firstName.message'), null);

  assert.equal(object.get('validations.attrs.lastName.isValid'), false);
  assert.equal(object.get('validations.attrs.lastName.isValidating'), false);
  assert.equal(object.get('validations.attrs.lastName.message'), 'lastName should be present');
});

test("basic sync validation returns null", function(assert) {
  var Validations = buildValidations({
    firstName: validator(() => null),
  });
  var object = setupObject(this, Ember.Object.extend(Validations), {
    firstName: 'Offir'
  });

  assert.equal(object.get('validations.isValid'), false, 'isValid was expected to be FALSE');
  assert.equal(object.get('validations.isValidating'), false, 'isValidating was expected to be FALSE');
  assert.equal(object.get('validations.isTruelyValid'), false, 'isTruelyValid was expected to be FALSE');

  assert.equal(object.get('validations.attrs.firstName.isValid'), false);
  assert.equal(object.get('validations.attrs.firstName.isValidating'), false);
  assert.equal(object.get('validations.attrs.firstName.message'), undefined);

});

test("shallow isAsync test", function(assert) {
  var Validations = buildValidations({
    firstName: validator(function() {
      return new Ember.RSVP.Promise((resolve, reject) => {
        resolve(true);
      });
    })
  });

  var obj = setupObject(this, Ember.Object.extend(Validations));

  assert.equal(obj.get('validations.attrs.firstName.isAsync'), true);
  assert.equal(Ember.canInvoke(obj.get('validations.attrs.firstName.value'), 'then'), true);

  return obj.validate().then(({
    model, validations
  }) => {
    assert.equal(model.get('validations.isValid'), true);
  });
});

test("default options", function(assert) {
  var Validations = buildValidations({
    firstName: {
      description: 'Test field',
      validators: [
        validator(Validators.presence),
        validator(() => false)
      ]
    }
  });
  var object = setupObject(this, Ember.Object.extend(Validations), {
    firstName: ''
  });
  var rules = Ember.A(object.get('validations._validationRules.firstName'));
  assert.equal(rules.isAny('defaultOptions', undefined), false);
  assert.equal(rules[0].defaultOptions.description, 'Test field');
});

test("global options", function(assert) {
  this.register('validator:length', LengthValidator);

  var Validations = buildValidations({
    firstName: {
      description: 'Test field',
      validators: [
        validator('length', {min: 1, max: 5}),
      ]
    }
  }, {
    message: 'Global error message',
    description: 'Default field',
    max: 10
  });

  var object = setupObject(this, Ember.Object.extend(Validations), {
    firstName: ''
  });

  // Global options present in rules
  var rules = Ember.A(object.get('validations._validationRules.firstName'));
  assert.equal(rules.isAny('globalOptions', undefined), false);
  assert.equal(rules[0].globalOptions.max, 10);

  assert.ok(object.get('validations.attrs.firstName.isInvalid'));

  var v = object.get('validations._validators.firstName.0');
  assert.deepEqual(v.get('options'), {
    message: 'Global error message',
    description: 'Test field',
    allowNone: true,
    min: 1,
    max: 5
  });
});

test("custom messages object", function(assert) {
  this.register('validator:messages', DefaultMessages);
  var Validations = buildValidations({
    firstName: validator(function(value) {
      return this.createErrorMessage('test', value);
    })
  });

  var object = setupObject(this, Ember.Object.extend(Validations));

  assert.equal(object.get('validations.attrs.firstName.isValid'), false);
  assert.equal(object.get('validations.attrs.firstName.isValidating'), false);
  assert.equal(object.get('validations.attrs.firstName.message'), 'Test error message');
});

test("debounced validations", function(assert) {
  var done = assert.async();
  var initSetup = true;
  var Validations = buildValidations({
    firstName: validator(Validators.presence),
    lastName: validator(Validators.presence, {
      debounce() {
        return initSetup ? 0 : 500; // Do not debounce on initial object creation
      }
    }),
  });
  var object = setupObject(this, Ember.Object.extend(Validations));

  assert.equal(object.get('validations.isValid'), false, 'isValid was expected to be FALSE');
  assert.equal(object.get('validations.isValidating'), false, 'isValidating was expected to be TRUE');
  assert.equal(object.get('validations.isTruelyValid'), false, 'isTruelyValid was expected to be FALSE');

  assert.equal(object.get('validations.attrs.lastName.isValid'), false);
  assert.equal(object.get('validations.attrs.lastName.isValidating'), false);
  assert.equal(object.get('validations.attrs.lastName.message'), 'lastName should be present');

  initSetup = false;
  object.set('lastName', 'Golan');
  assert.equal(object.get('validations.attrs.lastName.isValidating'), true);

  run.later(() => {
    assert.equal(object.get('validations.attrs.lastName.isValid'), true);
    assert.equal(object.get('validations.attrs.lastName.isValidating'), false);
    assert.equal(object.get('validations.attrs.lastName.message'), null);
    done();
  }, 500);
});

test("debounced validations should cleanup on object destroy", function(assert) {
  var done = assert.async();
  var initSetup = true;

  var debouncedValidator = validator((value, options, model, attr) => {
    model.set('foo', 'bar');
    return Validators.presence(value, options, model, attr);
  }, {
    debounce() {
      return initSetup ? 0 : 500; // Do not debounce on initial object creation
    }
  });

  var Validations = buildValidations({
    firstName: validator(Validators.presence),
    lastName: debouncedValidator,
    'details.url': debouncedValidator,
  });
  var object = setupObject(this, Ember.Object.extend(Validations), {
    details: {}
  });

  assert.equal(object.get('validations.isValid'), false, 'isValid was expected to be FALSE');
  assert.equal(object.get('validations.isValidating'), false, 'isValidating was expected to be TRUE');
  assert.equal(object.get('validations.isTruelyValid'), false, 'isTruelyValid was expected to be FALSE');

  assert.equal(object.get('validations.attrs.lastName.isValid'), false);
  assert.equal(object.get('validations.attrs.lastName.isValidating'), false);
  assert.equal(object.get('validations.attrs.lastName.message'), 'lastName should be present');

  initSetup = false;
  object.setProperties({
    'lastName': 'Golan',
    'details.url': 'github.com'
  });
  assert.equal(object.get('validations.attrs.lastName.isValidating'), true);
  assert.equal(object.get('validations.attrs.details.url.isValidating'), true);

  run.later(() => {
    try {
      object.destroy();
      assert.ok(true, 'Object destroy was clean');
    } catch(e) {}
    run.later(() => {
      done();
    }, 400);
  }, 200);
});

test("disabled validations - simple", function(assert) {
  var Validations = buildValidations({
    firstName: validator(Validators.presence),
    lastName: validator(Validators.presence, {
      disabled: true
    })
  });
  var object = setupObject(this, Ember.Object.extend(Validations));

  assert.equal(object.get('validations.isValid'), false, 'isValid was expected to be FALSE');
  assert.equal(object.get('validations.isValidating'), false, 'isValidating was expected to be TRUE');
  assert.equal(object.get('validations.isTruelyValid'), false, 'isTruelyValid was expected to be FALSE');

  assert.equal(object.get('validations.attrs.lastName.isValid'), true);
  assert.equal(object.get('validations.attrs.firstName.isValid'), false);

  object.set('firstName', 'Offir');

  assert.equal(object.get('validations.isValid'), true);
});

test("disabled validations - function with dependent key", function(assert) {
  var Validations = buildValidations({
    firstName: validator(Validators.presence),
    lastName: validator(Validators.presence, {
      dependentKeys: ['validateLastName'],
      disabled() {
        return !this.get('model.validateLastName');
      }
    })
  });
  var object = setupObject(this, Ember.Object.extend(Validations, {
    firstName: 'Offir',
    validateLastName: true
  }));

  assert.equal(object.get('validations.isValid'), false, 'isValid was expected to be FALSE');
  assert.equal(object.get('validations.isValidating'), false, 'isValidating was expected to be TRUE');
  assert.equal(object.get('validations.isTruelyValid'), false, 'isTruelyValid was expected to be FALSE');

  assert.equal(object.get('validations.attrs.lastName.isValid'), false);
  assert.equal(object.get('validations.attrs.firstName.isValid'), true);

  object.set('validateLastName', false);

  assert.equal(object.get('validations.attrs.lastName.isValid'), true);
  assert.equal(object.get('validations.isValid'), true);
});

test("destroy object clears debounce cache", function(assert) {
  var Validations = buildValidations({
    firstName: validator(Validators.presence),
    lastName: validator((value, options, model, attr) => {
      model.set('foo', 'bar');
      return Validators.presence(value, options, model, attr);
    }, { debounce: 500 }),
  });
  var object = setupObject(this, Ember.Object.extend(Validations));
  assert.equal(object.get('validations.isValid'), false, 'isValid was expected to be FALSE');
  assert.equal(Object.keys(object.get('validations._debouncedValidations')).length, 1);

  run(() => object.destroy());

  run(() => {
    assert.equal(Object.keys(object.get('validations._debouncedValidations')).length, 0);
  });
});

test("attribute validation result options hash", function(assert) {
  this.register('validator:length', LengthValidator);
  this.register('validator:presence', PresenceValidator);

  var Validations = buildValidations({
    firstName: {
      description: 'First Name',
      validators: [
        validator(Validators.presence, {}),
        validator(Validators.presence, { presence: true} ),
        validator('presence', true),
        validator('length', {
          min: 1,
          max: 5
        })
      ]
    }
  });
  var object = setupObject(this, Ember.Object.extend(Validations, { max: 5 }));
  var options = object.get('validations.attrs.firstName.options');

  assert.ok(options);
  assert.deepEqual(Object.keys(options).sort(), ['presence', 'length', 'function'].sort());
  assert.ok(Ember.isArray(options['function']) && options['function'].length === 2);
  assert.ok(options.presence.presence);
  assert.equal(options.length.min, 1);
  assert.ok(options['function'][1].presence);

  // Default options built into option objects
  assert.equal(options.length.description, 'First Name');
  assert.equal(options.presence.description, 'First Name');
  assert.equal(options['function'][0].description, 'First Name');
});

test("attribute validation result options hash with functions", function(assert) {
  assert.expect(5);
  this.register('validator:length', LengthValidator);

  var Validations = buildValidations({
    firstName: {
      validators: [
        validator('length', {
          dependentKeys: ['max'],
          min: 1,
          max(model) {
            assert.ok(true);
            return model.get('max');
          }
        })
      ]
    }
  });
  var object = setupObject(this, Ember.Object.extend(Validations, { max: 5 }));
  var options = object.get('validations.attrs.firstName.options');
  assert.equal(options.length.max, 5);

  run(() => object.set('max', 3));

  options = object.get('validations.attrs.firstName.options');
  assert.equal(options.length.max, 3);

  options = object.get('validations.attrs.firstName.options');
  assert.equal(options.length.max, 3);
});

test("validations persist with inheritance", function(assert) {
  var Parent = Ember.Object.extend(buildValidations({
    firstName: validator(Validators.presence),
    lastName: validator(Validators.presence)
  }));

  var Child = Parent.extend(buildValidations({
    middleName: validator(Validators.presence),
    dob: validator(Validators.presence)
  }));

  var child = setupObject(this, Child);

  child.validateSync();

  assert.equal(child.get('validations.errors.length'), 4);
  assert.equal(child.get('validations.isValid'), false);
  assert.deepEqual(child.get('validations.validatableAttributes').sort(), ['firstName', 'lastName', 'middleName', 'dob'].sort());

  child.setProperties({
    middleName: 'John',
    dob: '10/22/16'
  });

  assert.equal(child.get('validations.errors.length'), 2);

  child.setProperties({
    firstName: 'Joe',
    lastName: 'Jenkins'
  });

  assert.equal(child.get('validations.isValid'), true);
  assert.equal(child.get('validations.errors.length'), 0);
});

test("validations persist with deep inheritance", function(assert) {
  var Parent = Ember.Object.extend(buildValidations({
    firstName: validator(Validators.presence),
    lastName: validator(Validators.presence)
  }));

  var Child = Parent.extend(buildValidations({
    middleName: validator(Validators.presence),
    dob: validator(Validators.presence)
  }));

  var Baby = Child.extend(buildValidations({
    diaper: validator(Validators.presence),
    favParent: validator(Validators.presence)
  }));

  var baby = setupObject(this, Baby);

  baby.validateSync();

  assert.equal(baby.get('validations.errors.length'), 6);
  assert.equal(baby.get('validations.isValid'), false);
  assert.deepEqual(baby.get('validations.validatableAttributes').sort(), ['firstName', 'lastName', 'middleName', 'dob', 'diaper', 'favParent'].sort());

  baby.setProperties({
    middleName: 'John',
    dob: '10/22/16'
  });

  assert.equal(baby.get('validations.errors.length'), 4);

  baby.setProperties({
    firstName: 'Joe',
    lastName: 'Jenkins'
  });

  assert.equal(baby.get('validations.errors.length'), 2);

  baby.setProperties({
    diaper: 'soiled',
    favParent: 'mom'
  });

  assert.equal(baby.get('validations.isValid'), true);
  assert.equal(baby.get('validations.errors.length'), 0);
});

test("nested keys - simple", function(assert) {
  var Validations = buildValidations({
    'user.firstName': validator(Validators.presence),
    'user.lastName': validator(Validators.presence)
  });
  var object = setupObject(this, Ember.Object.extend(Validations), {
    user: {}
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

test("nested keys - complex", function(assert) {
  var Validations = buildValidations({
    'firstName': validator(Validators.presence),
    'user.foo.bar.baz': validator(Validators.presence),
    'user.foo.boop': validator(Validators.presence)
  });
  var object = setupObject(this, Ember.Object.extend(Validations));

  assert.equal(object.get('validations.attrs.firstName.isValid'), false);
  assert.equal(object.get('validations.attrs.user.foo.bar.baz.isValid'), false);
  assert.equal(object.get('validations.attrs.user.foo.boop.isValid'), false);
  assert.equal(object.get('validations.isValid'), false);

  object.set('user', { foo: { bar: {} } });

  assert.equal(object.get('validations.attrs.firstName.isValid'), false);
  assert.equal(object.get('validations.attrs.user.foo.bar.baz.isValid'), false);
  assert.equal(object.get('validations.attrs.user.foo.boop.isValid'), false);
  assert.equal(object.get('validations.isValid'), false);

  object.set('firstName', 'Offir');
  object.set('user.foo.bar.baz', 'blah');
  object.set('user.foo.boop', 'blah');

  assert.equal(object.get('validations.attrs.firstName.isValid'), true);
  assert.equal(object.get('validations.attrs.user.foo.bar.baz.isValid'), true);
  assert.equal(object.get('validations.attrs.user.foo.boop.isValid'), true);

  assert.ok(object.get('validations.attrs._model'));
  assert.ok(object.get('validations.attrs.user.foo.bar._model'));
  assert.ok(object.get('validations.attrs.user.foo._model'));

  assert.equal(object.get('validations.isValid'), true);
});

test("nested keys - inheritance", function(assert) {
  var Parent = Ember.Object.extend(buildValidations({
    'firstName': validator(Validators.presence),
    'user.firstName': validator(Validators.presence),
    'user.middleName': validator(Validators.presence)
  }));

  var Child = Parent.extend(buildValidations({
    'user.lastName': validator(Validators.presence),
    'user.middleName': validator(function() {
      return 'Middle name invalid';
    })
  }));

  var child = setupObject(this, Child);

  child.validateSync();

  assert.equal(child.get('validations.errors.length'), 4);
  assert.equal(child.get('validations.isValid'), false);
  assert.deepEqual(child.get('validations.validatableAttributes').sort(), ['firstName', 'user.firstName', 'user.middleName' ,'user.lastName'].sort());

  child.setProperties({
    user: {
      firstName: 'Offir',
      'middleName': 'David',
      lastName: 'Golan'
    }
  });

  assert.equal(child.get('validations.errors.length'), 2);
  assert.equal(child.get('validations.attrs.user.middleName.message'), 'Middle name invalid');

  child.setProperties({
    firstName: 'John'
  });

  assert.equal(child.get('validations.isValid'), false);
  assert.equal(child.get('validations.errors.length'), 1);
});


test("call super in validations class with no super property", function(assert) {
  // see https://github.com/offirgolan/ember-cp-validations/issues/149
  assert.expect(1);

  var Validations = buildValidations({
    'firstName': validator(Validators.presence)
  });

  var mixin = Ember.Mixin.create({
    actions: {
      foo() {
        // The issue is that __validationsClass__ is calling super but since
        // this is no __validationsClass__ method on the super, it is wrapped
        // with the closest context which is the 'foo' action
        assert.ok(false); // should not reach here
      }
    }
  });

  var component = setupObject(this, Ember.Component.extend(Validations, mixin, {
    actions: {
      foo() {
        assert.ok(true);
        const validations = this.get('validations');
      }
    }
  }));

  component.send('foo');
});


test("multiple mixins", function(assert) {
  var Validations1 = buildValidations({
    'firstName': validator(Validators.presence)
  });

  var Validations2 = buildValidations({
    'middleName': validator(Validators.presence)
  });

  var Validations3 = buildValidations({
    'lastName': validator(Validators.presence)
  });

  var object = setupObject(this, Ember.Object.extend(Validations1, Validations2, Validations3));

  assert.deepEqual(object.get('validations.validatableAttributes').sort(), ['firstName', 'middleName', 'lastName'].sort());
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

test("warning validators api", function(assert) {
  this.register('validator:length', LengthValidator);
  this.register('validator:presence', PresenceValidator);

  var Validations = buildValidations({
    password: {
      description: 'Password',
      validators: [
        validator('presence', {
          presence: true,
          isWarning: true,
          message: '{description} should not be empty'
        }),
        validator('length', {
          min: 4,
          isWarning: true,
          message: '{description} is weak'
        }),
        validator('length', {
          min: 1,
          max: 10
        })
      ]
    }
  });

  var object = setupObject(this, Ember.Object.extend(Validations), {
    password: ''
  });

  assert.equal(object.get('validations.isValid'), false);
  assert.equal(object.get('validations.attrs.password.isValid'), false);
  assert.equal(object.get('validations.attrs.password.warnings.length'), 2);
  assert.equal(object.get('validations.attrs.password.warningMessage'), 'Password should not be empty');
  assert.equal(object.get('validations.attrs.password.message'), 'Password is too short (minimum is 1 characters)');

  object.set('password', 'wat');

  assert.equal(object.get('validations.isValid'), true);
  assert.equal(object.get('validations.attrs.password.isValid'), true);
  assert.equal(object.get('validations.attrs.password.warnings.length'), 1);
  assert.equal(object.get('validations.attrs.password.warningMessage'), 'Password is weak');


});
