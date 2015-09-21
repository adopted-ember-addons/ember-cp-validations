import Ember from 'ember';
import DefaultMessages from 'dummy/validators/messages';
import CollectionValidator from 'dummy/validators/collection';
import LengthValidator from 'dummy/validators/length';
import BelongsToValidator from 'dummy/validators/belongs-to';
import HasManyValidator from 'dummy/validators/has-many';
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
  isPresent: {
    validate(value, options, model, attr) {
      var isValid = !Ember.isNone(value);

      if (Ember.isNone(value)) {
        return `${attr} should be present`;
      }

      return true;
    }
  }
};

var container, registry;

function register(fullName, factory) {
  (registry || container).register(fullName, factory);
}

function makeContainer() {
  var registry, container;

  if (Ember.Registry) {
    // new ember post container/registry refrom
    registry = new Ember.Registry();
    container = registry.container();
  } else {
    // pre container/registry reform=
    container = new Ember.Container();
  }

  return [container, registry];
}

module('Unit | Util | Validation Builder', {
  beforeEach() {
    [container, registry] = makeContainer();
  }
});

test("thing", function(assert) {
  assert.ok(buildValidations());
});

var Validations = buildValidations({
  firstName: validator(Validators.isPresent.validate),
  lastName: validator(Validators.isPresent.validate)
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

test("belong to validation - no cycle", function(assert) {
  register('validator:belongs-to', BelongsToValidator);

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
  register('validator:belongs-to', BelongsToValidator);

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
  register('validator:has-many', HasManyValidator);

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
  register('validator:belongs-to', BelongsToValidator);

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
  register('validator:belongs-to', BelongsToValidator);

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

test("collection validator creates correct dependent keys", function(assert) {
  register('validator:collection', CollectionValidator);
  register('validator:length', LengthValidator);
  register('validator:messages', DefaultMessages);

  var CollectionValidations = buildValidations({
    array: [
      validator('collection', true),
      validator('length', {
        is: 2,
        message: "must have %@ items"
      })
    ]
  });

  var obj = Ember.Object.extend(CollectionValidations).create({
    array: Ember.A(['foo', 'bar']),
    container
  });

  assert.equal(obj.get('validations.attrs.array.isValid'), true);

  obj.get('array').removeObject('bar');

  assert.equal(obj.get('validations.attrs.array.isValid'), false);
  assert.equal(obj.get('validations.attrs.array.message'), "This field must have 2 items");
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

test("custom dependent keys - simple", function(assert) {
  var Validations = buildValidations({
    fullName: validator(function(value, options, model) {
      let firstName = model.get('firstName');
      let lastName = model.get('lastName');
      if (!firstName || !lastName) {
        return 'Full name requires first and last name';
      }
      return true;
    }, {
      dependentKeys: ['firstName', 'lastName']
    })
  });

  var obj = Ember.Object.extend(Validations).create({
    container
  });

  assert.equal(obj.get('validations.isValid'), false);
  assert.equal(obj.get('validations.attrs.fullName.isValid'), false);
  assert.equal(obj.get('validations.attrs.fullName.message'), 'Full name requires first and last name');

  obj.set('firstName', 'Offir');
  obj.set('lastName', 'Golan');

  assert.equal(obj.get('validations.isValid'), true);
  assert.equal(obj.get('validations.attrs.fullName.isValid'), true);
});

test("custom dependent keys - nested object", function(assert) {
  var Validations = buildValidations({
    page: validator(function(value, options, model) {
      let currPage = model.get('currPage');
      let lastPage = model.get('meta.pages.last');
      if (currPage > lastPage) {
        return 'Cannot exceed max page';
      }
      return true;
    }, {
      dependentKeys: ['currPage', 'meta.pages.last']
    })
  });

  var obj = Ember.Object.extend(Validations).create({
    meta: {
      pages: {
        last: 5
      }
    },
    currPage: 4,
    container
  });

  assert.equal(obj.get('validations.isValid'), true);
  assert.equal(obj.get('validations.attrs.page.isValid'), true);

  obj.set('currPage', 6);

  assert.equal(obj.get('validations.isValid'), false);
  assert.equal(obj.get('validations.attrs.page.isValid'), false);
  assert.equal(obj.get('validations.attrs.page.message'), 'Cannot exceed max page');

  obj.set('meta.pages.last', 7);

  assert.equal(obj.get('validations.isValid'), true);
  assert.equal(obj.get('validations.attrs.page.isValid'), true);

});

test("custom dependent keys - array", function(assert) {
  var Validations = buildValidations({
    friends: validator(function(value, options, model) {
      let friends = model.get('friends');
      if (!friends || friends.length === 0) {
        return 'User must have a friend';
      }
      return true;
    }, {
      dependentKeys: ['friends.[]']
    })
  });

  var obj = Ember.Object.extend(Validations).create({
    friends: Ember.A(),
    container
  });

  assert.equal(obj.get('validations.isValid'), false);
  assert.equal(obj.get('validations.attrs.friends.isValid'), false);
  assert.equal(obj.get('validations.attrs.friends.message'), 'User must have a friend');

  obj.get('friends').pushObject('Offir');

  assert.equal(obj.get('validations.isValid'), true);
  assert.equal(obj.get('validations.attrs.friends.isValid'), true);

  obj.get('friends').removeObject('Offir');

  assert.equal(obj.get('validations.isValid'), false);
  assert.equal(obj.get('validations.attrs.friends.isValid'), false);
  assert.equal(obj.get('validations.attrs.friends.message'), 'User must have a friend');

});

test("custom dependent keys - array of objects", function(assert) {
  var Validations = buildValidations({
    friends: validator(function(value, options, model) {
      let friends = model.get('friends');
      if (!friends || friends.length === 0) {
        return 'User must have a friend';
      } else if (friends.length > 0) {
        let names = friends.filter(f => f.name);
        if (names.length !== friends.length) {
          return 'All friends must have a name';
        }
      }
      return true;
    }, {
      dependentKeys: ['friends.@each.name']
    })
  });

  var obj = Ember.Object.extend(Validations).create({
    friends: Ember.A(),
    container
  });

  assert.equal(obj.get('validations.isValid'), false);
  assert.equal(obj.get('validations.attrs.friends.isValid'), false);
  assert.equal(obj.get('validations.attrs.friends.message'), 'User must have a friend');

  obj.get('friends').pushObject(Ember.Object.create({
    name: 'Offir'
  }));

  assert.equal(obj.get('validations.isValid'), true);
  assert.equal(obj.get('validations.attrs.friends.isValid'), true);

  obj.get('friends.0').set('name', undefined);

  assert.equal(obj.get('validations.isValid'), false);
  assert.equal(obj.get('validations.attrs.friends.isValid'), false);
  assert.equal(obj.get('validations.attrs.friends.message'), 'All friends must have a name');

});
