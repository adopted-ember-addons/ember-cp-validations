import Ember from 'ember';
import DS from 'ember-data';
import DefaultMessages from 'dummy/validators/messages';
import BelongsToValidator from 'dummy/validators/belongs-to';
import HasManyValidator from 'dummy/validators/has-many';
import PresenceValidator from 'dummy/validators/presence';
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

module('Unit | Validations | Model Relationships', {
  beforeEach() {
    registry = new Registry();
    container = registry.get('container');
    registry.register('validator:messages', DefaultMessages);
  }
});

test("belong to validation - no cycle", function(assert) {
  registry.register('validator:belongs-to', BelongsToValidator);

  var BelongsToValidations = buildValidations({
    friend: validator('belongs-to')
  });

  var user2 = Ember.Object.extend(Validations).create({
    firstName: 'John',
    container
  });

  var user = Ember.Object.extend(BelongsToValidations).create({
    friend: user2,
    container
  });

  const {
    validations,
    model
  } = user.get('validations').validateSync();

  assert.equal(model, user, 'expected model to be the correct model');
  assert.deepEqual(validations.get('content').getEach('attribute').sort(), ['friend'].sort());

  let friend = validations.get('content').findBy('attribute', 'friend');

  assert.equal(friend.get('isValid'), false);
  assert.equal(friend.get('isValidating'), false);
  assert.equal(friend.get('message'), 'lastName should be present');

});

test("belong to validation - with cycle", function(assert) {
  registry.register('validator:belongs-to', BelongsToValidator);

  var BelongsToValidations = buildValidations({
    friend: validator('belongs-to')
  });

  var user = Ember.Object.extend(BelongsToValidations).create({
    container
  });
  user.set('friend', user);

  const {
    validations,
    model
  } = user.get('validations').validateSync();

  assert.equal(model, user, 'expected model to be the correct model');
  assert.deepEqual(validations.get('content').getEach('attribute').sort(), ['friend'].sort());

  let friend = validations.get('content').findBy('attribute', 'friend');

  assert.equal(friend.get('isValid'), true);
  assert.equal(friend.get('isValidating'), false);
  assert.equal(friend.get('message'), undefined);

});

test("has-many relationship is async", function(assert) {
  registry.register('validator:has-many', HasManyValidator);

  var HasManyValidations = buildValidations({
    friends: validator('has-many')
  });

  var friend = Ember.Object.extend(Validations).create({
    firstName: 'Offir',
    container
  });

  var user = Ember.Object.extend(HasManyValidations).create({
    friends: new Ember.RSVP.Promise((resolve, reject) => {
      resolve([friend]);
    }),
    container
  });

  var validations = user.get('validations').validate();
  assert.equal(user.get('validations.isAsync'), true);
  assert.equal(user.get('validations.isValidating'), true);

  validations.then(({
    model, validations
  }) => {
    assert.equal(model, user, 'expected model to be the correct model');
    assert.deepEqual(validations.get('content').getEach('attribute').sort(), ['friends'].sort());

    let friends = validations.get('content').findBy('attribute', 'friends');

    assert.equal(friends.get('isValid'), false);
    assert.equal(friends.get('message'), 'lastName should be present');
  });

  return validations;
});

test("belongs-to relationship is async", function(assert) {
  registry.register('validator:belongs-to', BelongsToValidator);

  var BelongsToValidations = buildValidations({
    friend: validator('belongs-to')
  });

  var friend = Ember.Object.extend(Validations).create({
    firstName: 'Offir',
    container
  });

  var user = Ember.Object.extend(BelongsToValidations).create({
    friend: new Ember.RSVP.Promise((resolve, reject) => {
      resolve(friend);
    }),
    container
  });

  var validations = user.get('validations').validate();
  assert.equal(user.get('validations.isAsync'), true);
  assert.equal(user.get('validations.isValidating'), true);

  validations.then(({
    model, validations
  }) => {
    assert.equal(model, user, 'expected model to be the correct model');
    assert.deepEqual(validations.get('content').getEach('attribute').sort(), ['friend'].sort());

    let friend = validations.get('content').findBy('attribute', 'friend');

    assert.equal(friend.get('isValid'), false);
    assert.equal(friend.get('message'), "lastName should be present");
  });

  return validations;
});


test("belongs-to relationship returns undefined", function(assert) {
  registry.register('validator:belongs-to', BelongsToValidator);

  var BelongsToValidations = buildValidations({
    friend: validator('belongs-to')
  });

  var user = Ember.Object.extend(BelongsToValidations).create({
    friend: new Ember.RSVP.Promise((resolve, reject) => {
      resolve({}); // validations object will be undefined
    }),
    container
  });

  var validations = user.get('validations').validate();
  assert.equal(user.get('validations.isAsync'), true);
  assert.equal(user.get('validations.isValidating'), true);

  validations.then(({
    model, validations
  }) => {
    assert.equal(model, user, 'expected model to be the correct model');
    assert.deepEqual(validations.get('content').getEach('attribute').sort(), ['friend'].sort());

    let friend = validations.get('content').findBy('attribute', 'friend');

    assert.equal(friend.get('isValid'), false);
    assert.equal(friend.get('message'), undefined);
  });

  return validations;
});

test("presence on empty DS.PromiseObject", function(assert) {
  registry.register('validator:presence', PresenceValidator);

  var Validations = buildValidations({
    friend: validator('presence', true)
  });

  var user = Ember.Object.extend(Validations).create({
    friend: DS.PromiseObject.create(),
    container
  });

  const {
    validations,
    model
  } = user.get('validations').validateSync();

  assert.equal(model, user, 'expected model to be the correct model');
  assert.deepEqual(validations.get('content').getEach('attribute').sort(), ['friend'].sort());

  let friend = validations.get('content').findBy('attribute', 'friend');

  assert.equal(friend.get('isValid'), false);
  assert.equal(friend.get('message'), "This field can't be blank");

});

test("presence on empty DS.PromiseArray", function(assert) {
  registry.register('validator:presence', PresenceValidator);

  var Validations = buildValidations({
    friends: validator('presence', true)
  });

  var user = Ember.Object.extend(Validations).create({
    friends: DS.PromiseArray.create(),
    container
  });

  const {
    validations,
    model
  } = user.get('validations').validateSync();

  assert.equal(model, user, 'expected model to be the correct model');
  assert.deepEqual(validations.get('content').getEach('attribute').sort(), ['friends'].sort());

  let friends = validations.get('content').findBy('attribute', 'friends');

  assert.equal(friends.get('isValid'), false);
  assert.equal(friends.get('message'), "This field can't be blank");

});
