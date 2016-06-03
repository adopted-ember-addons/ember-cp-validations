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

test("belong to validation - no cycle", function(assert) {
  this.register('validator:belongs-to', BelongsToValidator);

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
  assert.equal(friend.get('message'), 'lastName should be present');

});

test("belong to validation - with cycle", function(assert) {
  this.register('validator:belongs-to', BelongsToValidator);

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

test("has-many relationship is sync", function(assert) {
  this.register('validator:belongs-to', BelongsToValidator);

  var friend = setupObject(this, Ember.Object.extend(Validations), {
    firstName: 'John'
  });

  var user = setupObject(this, Ember.Object.extend(HasManyValidations), {
    friends: [friend]
  });

  const {
    validations,
    model
  } = user.get('validations').validateSync();

  assert.equal(model, user, 'expected model to be the correct model');
  assert.deepEqual(validations.get('content').getEach('attribute').sort(), ['friends'].sort());

  let friends = validations.get('content').findBy('attribute', 'friends');

  assert.equal(friends.get('isValid'), false);
  assert.equal(friends.get('message'), 'lastName should be present');
});

test("has-many relationship is sync with proxy", function(assert) {
  this.register('validator:belongs-to', BelongsToValidator);

  var friend = setupObject(this, Ember.Object.extend(Validations), {
    firstName: 'John'
  });

  var user = setupObject(this, Ember.Object.extend(HasManyValidations), {
    friends: Ember.ArrayProxy.create({ content: Ember.A([friend]) })
  });

  const {
    validations,
    model
  } = user.get('validations').validateSync();

  assert.equal(model, user, 'expected model to be the correct model');
  assert.deepEqual(validations.get('content').getEach('attribute').sort(), ['friends'].sort());

  let friends = validations.get('content').findBy('attribute', 'friends');

  assert.equal(friends.get('isValid'), false);
  assert.equal(friends.get('message'), 'lastName should be present');
});

test("has-many relationship is async", function(assert) {
  this.register('validator:has-many', HasManyValidator);

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
    assert.equal(friends.get('message'), 'lastName should be present');
  });

  return validations;
});

test("belongs-to relationship is async", function(assert) {
  this.register('validator:belongs-to', BelongsToValidator);

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
    assert.equal(friend.get('message'), "lastName should be present");
  });

  return validations;
});

test("belongs-to relationship is async and does not exist", function(assert) {
  this.register('validator:belongs-to', BelongsToValidator);

  var user = setupObject(this, Ember.Object.extend(BelongsToValidations), {
    friend: new Ember.RSVP.Promise((resolve, reject) => {
      resolve();
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
    assert.equal(user.get('validations.isValid'), true);
  });

  return validations;
});

test("has-many relationship is async and does not exist", function(assert) {
  this.register('validator:has-many', HasManyValidator);

  var user = setupObject(this, Ember.Object.extend(HasManyValidations), {
    friends: new Ember.RSVP.Promise((resolve, reject) => {
      resolve();
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
    assert.equal(user.get('validations.isValid'), true);
  });

  return validations;
});

test("belongs-to relationship returns undefined", function(assert) {
  this.register('validator:belongs-to', BelongsToValidator);

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

test("alias validation - simple", function(assert) {
  this.register('validator:alias', AliasValidator);

  var user = setupObject(this, Ember.Object.extend(buildValidations({
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

test("alias validation - firstMessageOnly", function(assert) {
  this.register('validator:alias', AliasValidator);

  var user = setupObject(this, Ember.Object.extend(buildValidations({
    firstName: [
      validator(() => 'First error message'),
      validator(() => 'Second error message'),
    ],
    fullName: validator('alias', {
      alias: 'firstName',
      firstMessageOnly: true
    })
  })));

  user.get('validations').validateSync();

  assert.equal(user.get('validations.isValid'), false);
  assert.equal(user.get('validations.isValidating'), false);
  assert.equal(user.get('validations.attrs.firstName.isValid'), false);
  assert.equal(user.get('validations.attrs.firstName.messages.length'), 2);
  assert.equal(user.get('validations.attrs.fullName.isValid'), false);
  assert.equal(user.get('validations.attrs.fullName.messages.length'), 1);
  assert.equal(user.get('validations.attrs.fullName.message'), 'First error message');
});

test("alias validation - multiple", function(assert) {
  this.register('validator:alias', AliasValidator);

  var user = setupObject(this, Ember.Object.extend(buildValidations({
    firstName: validator(Validators.presence),
    lastName: validator(Validators.presence),
    fullName: [
      validator('alias', 'firstName'),
      validator('alias', 'lastName')
    ]
  })));

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
