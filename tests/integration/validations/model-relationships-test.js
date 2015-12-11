import Ember from 'ember';
import DS from 'ember-data';
import setupObject from '../../helpers/setup-object';
import DefaultMessages from 'dummy/validators/messages';
import BelongsToValidator from 'dummy/validators/belongs-to';
import HasManyValidator from 'dummy/validators/has-many';
import PresenceValidator from 'dummy/validators/presence';
import { validator, buildValidations } from 'ember-cp-validations';
import { moduleFor, test } from 'ember-qunit';

var Validations = buildValidations({
  firstName: validator('presence', true),
  lastName: validator('presence', true)
});

moduleFor('foo', 'Integration | Validations | Model Relationships', {
  integration: true,
  beforeEach() {
    this.register('validator:messages', DefaultMessages);
    this.register('validator:presence', PresenceValidator);
  }
});

test("belong to validation - no cycle", function(assert) {
  this.register('validator:belongs-to', BelongsToValidator);

  var BelongsToValidations = buildValidations({
    friend: validator('belongs-to')
  });

  var user2 = setupObject(this, Ember.Object.extend(Validations), {
    firstName: 'John'
  });

  var user = setupObject(this, Ember.Object.extend(BelongsToValidations), {
    friend: user2
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
  assert.equal(friend.get('message'), "This field can't be blank");

});

test("belong to validation - with cycle", function(assert) {
  this.register('validator:belongs-to', BelongsToValidator);

  var BelongsToValidations = buildValidations({
    friend: validator('belongs-to')
  });

  var user = setupObject(this, Ember.Object.extend(BelongsToValidations));
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
  this.register('validator:has-many', HasManyValidator);

  var HasManyValidations = buildValidations({
    friends: validator('has-many')
  });

  var friend = setupObject(this, Ember.Object.extend(Validations), {
    firstName: 'Offir'
  });

  var user = setupObject(this, Ember.Object.extend(HasManyValidations), {
    friends: new Ember.RSVP.Promise((resolve, reject) => {
      resolve([friend]);
    })
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
    assert.equal(friends.get('message'), "This field can't be blank");
  });

  return validations;
});

test("belongs-to relationship is async", function(assert) {
  this.register('validator:belongs-to', BelongsToValidator);

  var BelongsToValidations = buildValidations({
    friend: validator('belongs-to')
  });

  var friend = setupObject(this, Ember.Object.extend(Validations), {
    firstName: 'Offir'
  });

  var user = setupObject(this, Ember.Object.extend(BelongsToValidations), {
    friend: new Ember.RSVP.Promise((resolve, reject) => {
      resolve(friend);
    })
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
    assert.equal(friend.get('message'), "This field can't be blank");
  });

  return validations;
});


test("belongs-to relationship returns undefined", function(assert) {
  this.register('validator:belongs-to', BelongsToValidator);

  var BelongsToValidations = buildValidations({
    friend: validator('belongs-to')
  });

  var user = setupObject(this, Ember.Object.extend(BelongsToValidations), {
    friend: new Ember.RSVP.Promise((resolve, reject) => {
      resolve({}); // validations object will be undefined
    })
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
  this.register('validator:presence', PresenceValidator);

  var Validations = buildValidations({
    friend: validator('presence', true)
  });

  var user = setupObject(this, Ember.Object.extend(Validations), {
    friend: DS.PromiseObject.create()
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
  this.register('validator:presence', PresenceValidator);

  var Validations = buildValidations({
    friends: validator('presence', true)
  });

  var user = setupObject(this, Ember.Object.extend(Validations), {
    friends: DS.PromiseArray.create()
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
