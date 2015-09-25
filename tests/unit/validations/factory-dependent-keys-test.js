import Ember from 'ember';
import DefaultMessages from 'dummy/validators/messages';
import CollectionValidator from 'dummy/validators/collection';
import LengthValidator from 'dummy/validators/length';
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

var container, registry;

module('Unit | Validations | Factory - Dependent Keys', {
  beforeEach() {
    registry = new Registry();
    container = registry.get('container');
    registry.register('validator:messages', DefaultMessages);
  }
});

test("collection validator creates correct dependent keys", function(assert) {
  registry.register('validator:collection', CollectionValidator);
  registry.register('validator:length', LengthValidator);

  var CollectionValidations = buildValidations({
    array: [
      validator('collection', true),
      validator('length', {
        is: 2,
        message: "Array must have {count} items"
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
  assert.equal(obj.get('validations.attrs.array.message'), "Array must have 2 items");
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
