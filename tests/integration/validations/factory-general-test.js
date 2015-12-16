import Ember from 'ember';
import setupObject from '../../helpers/setup-object';
import DefaultMessages from 'dummy/validators/messages';
import { validator, buildValidations } from 'ember-cp-validations';
import { moduleFor, test } from 'ember-qunit';

var Validators = {
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
