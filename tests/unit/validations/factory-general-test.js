import Ember from 'ember';
import DefaultMessages from 'dummy/validators/messages';
import CollectionValidator from 'dummy/validators/collection';
import LengthValidator from 'dummy/validators/length';
import BelongsToValidator from 'dummy/validators/belongs-to';
import HasManyValidator from 'dummy/validators/has-many';
import Registry from '../../helpers/registry';
import {
  validator, buildValidations
}
from 'ember-cp-validations';
import {
  module,
  test
}
from 'qunit';

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

var container, registry;

module('Unit | Validations | Factory - General', {
  beforeEach() {
    registry = new Registry();
    container = registry.get('container');
  }
});

test("thing", function(assert) {
  assert.ok(buildValidations());
});

test("basic sync validation – invalid", function(assert) {
  var object = Ember.Object.extend(Validations).create({
    container
  });

  assert.equal(object.get('validations.isValid'), false, 'isValid was expected to be FALSE');
  assert.equal(object.get('validations.isValidating'), false, 'isValidating was expected to be FALSE');
  assert.equal(object.get('validations.isTruelyValid'), false, 'isTruelyValid was expected to be FALSE');

  assert.equal(object.get('validations.attrs.firstName.isValid'), false);
  assert.equal(object.get('validations.attrs.firstName.isValidating'), false);
  assert.equal(object.get('validations.attrs.firstName.message'), 'firstName should be present');

  assert.equal(object.get('validations.attrs.lastName.isValid'), false);
  assert.equal(object.get('validations.attrs.lastName.isValidating'), false);
  assert.equal(object.get('validations.attrs.lastName.message'), 'lastName should be present');

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
});

test("basic sync validation - valid", function(assert) {
  var object = Ember.Object.extend(Validations).create({
    firstName: 'Stef',
    lastName: 'Penner',
    container
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
  var object = Ember.Object.extend(Validations).create({
    firstName: 'Stef',
    container
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
  var object = Ember.Object.extend(Validations).create({
    firstName: 'Stef',
    container
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
  var object = Ember.Object.extend(Validations).create({
    firstName: 'Stef',
    container
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
  var object = Ember.Object.extend(Validations).create({
    firstName: 'Offir',
    container
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

  var obj = Ember.Object.extend(Validations).create({
    container
  });

  assert.equal(obj.get('validations.attrs.firstName.isAsync'), true);
  assert.equal(Ember.canInvoke(obj.get('validations.attrs.firstName.value'), 'then'), true);

  return obj.validate().then(({
    model, validations
  }) => {
    assert.equal(model.get('validations.isValid'), true);
  });
});
