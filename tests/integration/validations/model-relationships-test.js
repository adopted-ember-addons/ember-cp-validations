import Ember from 'ember';
import DS from 'ember-data';
import setupObject from '../../helpers/setup-object';
import DefaultMessages from 'dummy/validators/messages';
import BelongsToValidator from 'ember-cp-validations/validators/belongs-to';
import HasManyValidator from 'ember-cp-validations/validators/has-many';
import AliasValidator from 'ember-cp-validations/validators/alias';
import PresenceValidator from 'ember-cp-validations/validators/presence';
import { validator, buildValidations } from 'ember-cp-validations';
import { moduleFor, test } from 'ember-qunit';

const {
  A: emberArray
} = Ember;

const Validators = {
  presence(value, options, model, attr) {
    if (Ember.isNone(value)) {
      return `${attr} should be present`;
    }
    return true;
  }
};

const Validations = buildValidations({
  firstName: validator(Validators.presence),
  lastName: validator(Validators.presence)
});

const BelongsToValidations = buildValidations({
  friend: validator('belongs-to')
});

const HasManyValidations = buildValidations({
  friends: validator('has-many')
});

moduleFor('foo', 'Integration | Validations | Model Relationships', {
  integration: true,
  beforeEach() {
    this.register('validator:messages', DefaultMessages);
  }
});

test('belong to validation - no cycle', function(assert) {
  this.register('validator:belongs-to', BelongsToValidator);

  let user2 = setupObject(this, Ember.Object.extend(Validations), {
    firstName: 'John'
  });

  let user = setupObject(this, Ember.Object.extend(BelongsToValidations), {
    friend: user2
  });

  let {
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

test('belong to validation - with cycle', function(assert) {
  this.register('validator:belongs-to', BelongsToValidator);

  let user = setupObject(this, Ember.Object.extend(BelongsToValidations));
  user.set('friend', user);

  let {
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

test('has-many relationship is sync', function(assert) {
  this.register('validator:has-many', HasManyValidator);

  let friend = setupObject(this, Ember.Object.extend(Validations), {
    firstName: 'John'
  });

  let user = setupObject(this, Ember.Object.extend(HasManyValidations), {
    friends: [friend]
  });

  let {
    validations,
    model
  } = user.get('validations').validateSync();

  assert.equal(model, user, 'expected model to be the correct model');
  assert.deepEqual(validations.get('content').getEach('attribute').sort(), ['friends'].sort());

  let friends = validations.get('content').findBy('attribute', 'friends');

  assert.equal(friends.get('isValid'), false);
  assert.equal(friends.get('message'), 'lastName should be present');
});

test('has-many relationship is sync with proxy', function(assert) {
  this.register('validator:has-many', HasManyValidator);

  let friend = setupObject(this, Ember.Object.extend(Validations), {
    firstName: 'John'
  });

  let user = setupObject(this, Ember.Object.extend(HasManyValidations), {
    friends: Ember.ArrayProxy.create({ content: Ember.A([friend]) })
  });

  let {
    validations,
    model
  } = user.get('validations').validateSync();

  assert.equal(model, user, 'expected model to be the correct model');
  assert.deepEqual(validations.get('content').getEach('attribute').sort(), ['friends'].sort());

  let friends = validations.get('content').findBy('attribute', 'friends');

  assert.equal(friends.get('isValid'), false);
  assert.equal(friends.get('message'), 'lastName should be present');
});

test('has-many relationship is async', function(assert) {
  this.register('validator:has-many', HasManyValidator);

  let friend = setupObject(this, Ember.Object.extend(Validations), {
    firstName: 'Offir'
  });

  let user = setupObject(this, Ember.Object.extend(HasManyValidations), {
    friends: new Ember.RSVP.Promise((resolve) => {
      resolve([friend]);
    })
  });

  let validations = user.get('validations').validate();
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

test('has-many relationship is async and isWarning', function(assert) {
  this.register('validator:has-many', HasManyValidator);

  let HasManyValidations = buildValidations({
    friends: validator('has-many', { isWarning: true })
  });

  let friend = setupObject(this, Ember.Object.extend(Validations), {
    firstName: 'Offir'
  });

  let user = setupObject(this, Ember.Object.extend(HasManyValidations), {
    friends: new Ember.RSVP.Promise((resolve) => {
      resolve([friend]);
    })
  });

  let validations = user.get('validations').validate();
  assert.equal(user.get('validations.isAsync'), true);
  assert.equal(user.get('validations.isValidating'), true);

  validations.then(({
    model, validations
  }) => {
    assert.equal(model, user, 'expected model to be the correct model');
    assert.deepEqual(validations.get('content').getEach('attribute').sort(), ['friends'].sort());

    let friends = validations.get('content').findBy('attribute', 'friends');

    assert.equal(friends.get('isValid'), true);
  });

  return validations;
});

test('belongs-to relationship is async', function(assert) {
  this.register('validator:belongs-to', BelongsToValidator);

  let friend = setupObject(this, Ember.Object.extend(Validations), {
    firstName: 'Offir'
  });

  let user = setupObject(this, Ember.Object.extend(BelongsToValidations), {
    friend: new Ember.RSVP.Promise((resolve) => {
      resolve(friend);
    })
  });

  let validations = user.get('validations').validate();
  assert.equal(user.get('validations.isAsync'), true);
  assert.equal(user.get('validations.isValidating'), true);

  validations.then(({
    model, validations
  }) => {
    assert.equal(model, user, 'expected model to be the correct model');
    assert.deepEqual(validations.get('content').getEach('attribute').sort(), ['friend'].sort());

    let friend = validations.get('content').findBy('attribute', 'friend');

    assert.equal(friend.get('isValid'), false);
    assert.equal(friend.get('message'), 'lastName should be present');
  });

  return validations;
});

test('belongs-to relationship is async and isWarning', function(assert) {
  this.register('validator:belongs-to', BelongsToValidator);

  let BelongsToValidations = buildValidations({
    friend: validator('belongs-to', { isWarning: true })
  });

  let friend = setupObject(this, Ember.Object.extend(Validations), {
    firstName: 'Offir'
  });

  let user = setupObject(this, Ember.Object.extend(BelongsToValidations), {
    friend: new Ember.RSVP.Promise((resolve) => {
      resolve(friend);
    })
  });

  let validations = user.get('validations').validate();
  assert.equal(user.get('validations.isAsync'), true);
  assert.equal(user.get('validations.isValidating'), true);

  validations.then(({
    model, validations
  }) => {
    assert.equal(model, user, 'expected model to be the correct model');
    assert.deepEqual(validations.get('content').getEach('attribute').sort(), ['friend'].sort());

    let friend = validations.get('content').findBy('attribute', 'friend');

    assert.equal(friend.get('isValid'), true);
  });

  return validations;
});

test('belongs-to relationship is async and does not exist', function(assert) {
  this.register('validator:belongs-to', BelongsToValidator);

  let user = setupObject(this, Ember.Object.extend(BelongsToValidations), {
    friend: new Ember.RSVP.Promise((resolve) => {
      resolve();
    })
  });

  let validations = user.get('validations').validate();
  assert.equal(user.get('validations.isAsync'), true);
  assert.equal(user.get('validations.isValidating'), true);

  validations.then(({
    model, validations
  }) => {
    assert.equal(model, user, 'expected model to be the correct model');
    assert.deepEqual(validations.get('content').getEach('attribute').sort(), ['friend'].sort());
    assert.equal(user.get('validations.isValid'), true);
  });

  return validations;
});

test('has-many relationship is async and does not exist', function(assert) {
  this.register('validator:has-many', HasManyValidator);

  let user = setupObject(this, Ember.Object.extend(HasManyValidations), {
    friends: new Ember.RSVP.Promise((resolve) => {
      resolve();
    })
  });

  let validations = user.get('validations').validate();
  assert.equal(user.get('validations.isAsync'), true);
  assert.equal(user.get('validations.isValidating'), true);

  validations.then(({
    model, validations
  }) => {
    assert.equal(model, user, 'expected model to be the correct model');
    assert.deepEqual(validations.get('content').getEach('attribute').sort(), ['friends'].sort());
    assert.equal(user.get('validations.isValid'), true);
  });

  return validations;
});

test('belongs-to relationship returns undefined', function(assert) {
  this.register('validator:belongs-to', BelongsToValidator);

  let user = setupObject(this, Ember.Object.extend(BelongsToValidations), {
    friend: new Ember.RSVP.Promise((resolve) => {
      resolve(); // validations object will be undefined
    })
  });

  let validations = user.get('validations').validate();
  assert.equal(user.get('validations.isAsync'), true);
  assert.equal(user.get('validations.isValidating'), true);

  validations.then(({
    model, validations
  }) => {
    assert.equal(model, user, 'expected model to be the correct model');
    assert.deepEqual(validations.get('content').getEach('attribute').sort(), ['friend'].sort());

    let friend = validations.get('content').findBy('attribute', 'friend');

    assert.equal(friend.get('isValid'), true);
    assert.equal(friend.get('message'), undefined);
  });

  return validations;
});

test('alias validation - simple', function(assert) {
  this.register('validator:alias', AliasValidator);

  let user = setupObject(this, Ember.Object.extend(buildValidations({
    firstName: validator(Validators.presence),
    lastName: validator(Validators.presence),
    fullName: validator('alias', 'firstName')
  })));

  user.get('validations').validateSync();

  assert.equal(user.get('validations.isValid'), false);
  assert.equal(user.get('validations.isValidating'), false);
  assert.equal(user.get('validations.attrs.firstName.isValid'), false);
  assert.equal(user.get('validations.attrs.fullName.isValid'), false);
  assert.equal(user.get('validations.attrs.fullName.message'), 'firstName should be present');
  assert.equal(user.get('validations.attrs.fullName.error.attribute'), 'firstName');
  assert.equal(user.get('validations.attrs.fullName.error.parentAttribute'), 'fullName');
  assert.equal(user.get('validations.attrs.fullName.error.message'), 'firstName should be present');

  user.set('firstName', 'Offir');

  assert.equal(user.get('validations.attrs.firstName.isValid'), true);
  assert.equal(user.get('validations.attrs.fullName.isValid'), true);
});

test('alias validation - firstMessageOnly', function(assert) {
  this.register('validator:alias', AliasValidator);

  let user = setupObject(this, Ember.Object.extend(buildValidations({
    firstName: [
      validator(() => 'First error message'),
      validator(() => 'Second error message')
    ],
    fullName: validator('alias', {
      alias: 'firstName',
      firstMessageOnly: true
    })
  }, { lazy: false })));

  user.get('validations').validateSync();

  assert.equal(user.get('validations.isValid'), false);
  assert.equal(user.get('validations.isValidating'), false);
  assert.equal(user.get('validations.attrs.firstName.isValid'), false);
  assert.equal(user.get('validations.attrs.firstName.messages.length'), 2);
  assert.equal(user.get('validations.attrs.fullName.isValid'), false);
  assert.equal(user.get('validations.attrs.fullName.messages.length'), 1);
  assert.equal(user.get('validations.attrs.fullName.message'), 'First error message');
});

test('alias validation - multiple', function(assert) {
  this.register('validator:alias', AliasValidator);

  let user = setupObject(this, Ember.Object.extend(buildValidations({
    firstName: validator(Validators.presence),
    lastName: validator(Validators.presence),
    fullName: [
      validator('alias', 'firstName'),
      validator('alias', 'lastName')
    ]
  }, { lazy: false })));

  user.get('validations').validateSync();

  assert.equal(user.get('validations.isValid'), false);
  assert.equal(user.get('validations.isValidating'), false);
  assert.equal(user.get('validations.attrs.firstName.isValid'), false);
  assert.equal(user.get('validations.attrs.lastName.isValid'), false);
  assert.equal(user.get('validations.attrs.fullName.isValid'), false);
  assert.deepEqual(user.get('validations.attrs.fullName.messages').sort(), ['firstName should be present', 'lastName should be present'].sort());
  assert.ok(emberArray(user.get('validations.attrs.fullName.errors')).isEvery('parentAttribute', 'fullName'));

  user.set('firstName', 'Offir');

  assert.equal(user.get('validations.attrs.firstName.isValid'), true);
  assert.equal(user.get('validations.attrs.lastName.isValid'), false);
  assert.equal(user.get('validations.attrs.fullName.isValid'), false);

  user.set('lastName', 'Golan');

  assert.equal(user.get('validations.attrs.lastName.isValid'), true);
  assert.equal(user.get('validations.attrs.fullName.isValid'), true);
});

test('presence on empty DS.PromiseObject', function(assert) {
  this.register('validator:presence', PresenceValidator);

  let Validations = buildValidations({
    friend: validator('presence', true)
  });

  let user = setupObject(this, Ember.Object.extend(Validations), {
    friend: DS.PromiseObject.create()
  });

  let {
    validations,
    model
  } = user.get('validations').validateSync();

  assert.equal(model, user, 'expected model to be the correct model');
  assert.deepEqual(validations.get('content').getEach('attribute').sort(), ['friend'].sort());

  let friend = validations.get('content').findBy('attribute', 'friend');

  assert.equal(friend.get('isValid'), false);
  assert.equal(friend.get('message'), 'This field can\'t be blank');
});

test('presence on empty DS.PromiseArray', function(assert) {
  this.register('validator:presence', PresenceValidator);

  let Validations = buildValidations({
    friends: validator('presence', true)
  });

  let user = setupObject(this, Ember.Object.extend(Validations), {
    friends: DS.PromiseArray.create()
  });

  let {
    validations,
    model
  } = user.get('validations').validateSync();

  assert.equal(model, user, 'expected model to be the correct model');
  assert.deepEqual(validations.get('content').getEach('attribute').sort(), ['friends'].sort());

  let friends = validations.get('content').findBy('attribute', 'friends');

  assert.equal(friends.get('isValid'), false);
  assert.equal(friends.get('message'), 'This field can\'t be blank');
});

test('debounce should work across nested HasMany relationships', function(assert) {
  this.register('validator:presence', PresenceValidator);
  this.register('validator:has-many', HasManyValidator);

  let done = assert.async();

  let FriendValidations = buildValidations({
    name: validator('presence', { presence: true, debounce: 50 })
  });

  let friend = setupObject(this, Ember.Object.extend(FriendValidations));
  let user = setupObject(this, Ember.Object.extend(HasManyValidations), {
    friends: new Ember.RSVP.Promise((resolve) => {
      resolve([ friend ]); // validations object will be undefined
    })
  });

  user.validate().then(({ validations }) => {
    assert.equal(friend.get('validations.isValidating'), false, 'All promises should be resolved');
    assert.equal(user.get('validations.isValidating'), false, 'All promises should be resolved');
    assert.equal(validations.get('isValidating'), false, 'All promises should be resolved');
    assert.equal(validations.get('isValid'), false, 'User should not be valid');

    friend.set('name', 'Offir');
    return user.validate();

  }).then(({ validations }) => {
    assert.equal(friend.get('validations.isValidating'), false, 'All promises should be resolved');
    assert.equal(user.get('validations.isValidating'), false, 'All promises should be resolved');
    assert.equal(validations.get('isValidating'), false, 'All promises should be resolved');
    assert.equal(validations.get('isValid'), true, 'User should be valid');
    done();
  });
});

test('debounce should work across nested BelongsTo relationships', function(assert) {
  this.register('validator:presence', PresenceValidator);
  this.register('validator:belongs-to', BelongsToValidator);

  let done = assert.async();

  let FriendValidations = buildValidations({
    name: validator('presence', { presence: true, debounce: 50 })
  });

  let friend = setupObject(this, Ember.Object.extend(FriendValidations));

  let user2 = setupObject(this, Ember.Object.extend(BelongsToValidations), {
    friend: new Ember.RSVP.Promise((resolve) => {
      resolve(friend);
    })
  });

  let user = setupObject(this, Ember.Object.extend(BelongsToValidations), {
    friend: new Ember.RSVP.Promise((resolve) => {
      resolve(user2);
    })
  });

  user.validate().then(({ validations }) => {
    assert.equal(friend.get('validations.isValidating'), false, 'All promises should be resolved');
    assert.equal(user.get('validations.isValidating'), false, 'All promises should be resolved');
    assert.equal(validations.get('isValidating'), false, 'All promises should be resolved');
    assert.equal(validations.get('isValid'), false, 'User should not be valid');

    friend.set('name', 'Offir');
    return user.validate();

  }).then(({ validations }) => {
    assert.equal(friend.get('validations.isValidating'), false, 'All promises should be resolved');
    assert.equal(user.get('validations.isValidating'), false, 'All promises should be resolved');
    assert.equal(validations.get('isValidating'), false, 'All promises should be resolved');
    assert.equal(validations.get('isValid'), true, 'User should be valid');
    done();
  });
});
