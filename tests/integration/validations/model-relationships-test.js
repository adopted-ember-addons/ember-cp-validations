import { Promise as EmberPromise } from 'rsvp';
import ArrayProxy from '@ember/array/proxy';
import { isNone } from '@ember/utils';
import { A as emberArray } from '@ember/array';
// eslint-disable-next-line ember/use-ember-data-rfc-395-imports
import { PromiseArray, PromiseObject } from 'ember-data';
import setupObject from '../../helpers/setup-object';
import DefaultMessages from 'dummy/validators/messages';
import BelongsToValidator from 'ember-cp-validations/validators/belongs-to';
import HasManyValidator from 'ember-cp-validations/validators/has-many';
import AliasValidator from 'ember-cp-validations/validators/alias';
import PresenceValidator from 'ember-cp-validations/validators/presence';
import { validator, buildValidations } from 'ember-cp-validations';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

const Validators = {
  presence(value, options, model, attr) {
    if (isNone(value)) {
      return `${attr} should be present`;
    }
    return true;
  },
};

const Validations = {
  firstName: validator('inline', { validate: Validators.presence }),
  lastName: validator('inline', { validate: Validators.presence }),
};

const BelongsToValidations = {
  friend: validator('belongs-to'),
};

const HasManyValidations = {
  friends: validator('has-many'),
};

module('Integration | Validations | Model Relationships', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('validator:messages', DefaultMessages);
  });

  test('belong to validation - no cycle', function (assert) {
    this.owner.register('validator:belongs-to', BelongsToValidator);

    let user2 = setupObject(this, Validations, {
      firstName: 'John',
    });

    let user = setupObject(this, BelongsToValidations, {
      friend: user2,
    });

    let { validations, model } = user.get('validations').validateSync();

    assert.deepEqual(model, user, 'expected model to be the correct model');
    assert.deepEqual(
      validations.get('content').getEach('attribute').sort(),
      ['friend'].sort()
    );

    let friend = validations.get('content').findBy('attribute', 'friend');

    assert.false(friend.get('isValid'));
    assert.false(friend.get('isValidating'));
    assert.deepEqual(friend.get('message'), 'lastName should be present');
  });

  test('belong to validation - with cycle', function (assert) {
    this.owner.register('validator:belongs-to', BelongsToValidator);

    let user = setupObject(this, BelongsToValidations);
    user.set('friend', user);

    let { validations, model } = user.get('validations').validateSync();

    assert.deepEqual(model, user, 'expected model to be the correct model');
    assert.deepEqual(
      validations.get('content').getEach('attribute').sort(),
      ['friend'].sort()
    );

    let friend = validations.get('content').findBy('attribute', 'friend');

    assert.true(friend.get('isValid'));
    assert.false(friend.get('isValidating'));
    assert.deepEqual(friend.get('message'), undefined);
  });

  test('has-many relationship is sync', function (assert) {
    this.owner.register('validator:has-many', HasManyValidator);

    let friend = setupObject(this, Validations, {
      firstName: 'John',
    });

    let user = setupObject(this, HasManyValidations, {
      friends: [friend],
    });

    let { validations, model } = user.get('validations').validateSync();

    assert.deepEqual(model, user, 'expected model to be the correct model');
    assert.deepEqual(
      validations.get('content').getEach('attribute').sort(),
      ['friends'].sort()
    );

    let friends = validations.get('content').findBy('attribute', 'friends');

    assert.false(friends.get('isValid'));
    assert.deepEqual(friends.get('message'), 'lastName should be present');
  });

  test('has-many relationship is sync with proxy', function (assert) {
    this.owner.register('validator:has-many', HasManyValidator);

    let friend = setupObject(this, Validations, {
      firstName: 'John',
    });

    let user = setupObject(this, HasManyValidations, {
      friends: ArrayProxy.create({ content: emberArray([friend]) }),
    });

    let { validations, model } = user.get('validations').validateSync();

    assert.deepEqual(model, user, 'expected model to be the correct model');
    assert.deepEqual(
      validations.get('content').getEach('attribute').sort(),
      ['friends'].sort()
    );

    let friends = validations.get('content').findBy('attribute', 'friends');

    assert.false(friends.get('isValid'));
    assert.deepEqual(friends.get('message'), 'lastName should be present');
  });

  test('has-many relationship is async', function (assert) {
    assert.expect(6);
    this.owner.register('validator:has-many', HasManyValidator);

    let friend = setupObject(this, Validations, {
      firstName: 'Offir',
    });

    let user = setupObject(this, HasManyValidations, {
      friends: new EmberPromise((resolve) => {
        resolve([friend]);
      }),
    });

    let validations = user.get('validations').validate();
    assert.true(user.get('validations.isAsync'));
    assert.true(user.get('validations.isValidating'));

    validations.then(({ model, validations }) => {
      assert.deepEqual(model, user, 'expected model to be the correct model');
      assert.deepEqual(
        validations.get('content').getEach('attribute').sort(),
        ['friends'].sort()
      );

      let friends = validations.get('content').findBy('attribute', 'friends');

      assert.false(friends.get('isValid'));
      assert.deepEqual(friends.get('message'), 'lastName should be present');
    });

    return validations;
  });

  test('has-many relationship is async and isWarning', function (assert) {
    assert.expect(7);
    this.owner.register('validator:has-many', HasManyValidator);

    let HasManyValidations = {
      friends: validator('has-many', { isWarning: true }),
    };

    let friend = setupObject(this, Validations, {
      firstName: 'Offir',
    });

    let user = setupObject(this, HasManyValidations, {
      friends: new EmberPromise((resolve) => {
        resolve([friend]);
      }),
    });

    let validations = user.get('validations').validate();
    assert.true(user.get('validations.isAsync'));
    assert.true(user.get('validations.isValidating'));

    validations.then(({ model, validations }) => {
      assert.deepEqual(model, user, 'expected model to be the correct model');
      assert.deepEqual(
        validations.get('content').getEach('attribute').sort(),
        ['friends'].sort()
      );

      let friends = validations.get('content').findBy('attribute', 'friends');

      assert.deepEqual(
        friends.get('warning.message'),
        'lastName should be present'
      );
      assert.deepEqual(
        friends.get('warningMessage'),
        'lastName should be present'
      );
      assert.true(friends.get('isValid'));
    });

    return validations;
  });

  test('belongs-to relationship is async', function (assert) {
    assert.expect(6);
    this.owner.register('validator:belongs-to', BelongsToValidator);

    let friend = setupObject(this, Validations, {
      firstName: 'Offir',
    });

    let user = setupObject(this, BelongsToValidations, {
      friend: new EmberPromise((resolve) => {
        resolve(friend);
      }),
    });

    let validations = user.get('validations').validate();
    assert.true(user.get('validations.isAsync'));
    assert.true(user.get('validations.isValidating'));

    validations.then(({ model, validations }) => {
      assert.deepEqual(model, user, 'expected model to be the correct model');
      assert.deepEqual(
        validations.get('content').getEach('attribute').sort(),
        ['friend'].sort()
      );

      let friend = validations.get('content').findBy('attribute', 'friend');

      assert.false(friend.get('isValid'));
      assert.deepEqual(friend.get('message'), 'lastName should be present');
    });

    return validations;
  });

  test('belongs-to relationship is async and isWarning', function (assert) {
    assert.expect(7);
    this.owner.register('validator:belongs-to', BelongsToValidator);

    let BelongsToValidations = {
      friend: validator('belongs-to', { isWarning: true }),
    };

    let friend = setupObject(this, Validations, {
      firstName: 'Offir',
    });

    let user = setupObject(this, BelongsToValidations, {
      friend: new EmberPromise((resolve) => {
        resolve(friend);
      }),
    });

    let validations = user.get('validations').validate();
    assert.true(user.get('validations.isAsync'));
    assert.true(user.get('validations.isValidating'));

    validations.then(({ model, validations }) => {
      assert.deepEqual(model, user, 'expected model to be the correct model');
      assert.deepEqual(
        validations.get('content').getEach('attribute').sort(),
        ['friend'].sort()
      );

      let friend = validations.get('content').findBy('attribute', 'friend');

      assert.deepEqual(
        friend.get('warning.message'),
        'lastName should be present'
      );
      assert.deepEqual(
        friend.get('warningMessage'),
        'lastName should be present'
      );
      assert.true(friend.get('isValid'));
    });

    return validations;
  });

  test('belongs-to relationship is async and does not exist', function (assert) {
    assert.expect(5);
    this.owner.register('validator:belongs-to', BelongsToValidator);

    let user = setupObject(this, BelongsToValidations, {
      friend: new EmberPromise((resolve) => {
        resolve();
      }),
    });

    let validations = user.get('validations').validate();
    assert.true(user.get('validations.isAsync'));
    assert.true(user.get('validations.isValidating'));

    validations.then(({ model, validations }) => {
      assert.deepEqual(model, user, 'expected model to be the correct model');
      assert.deepEqual(
        validations.get('content').getEach('attribute').sort(),
        ['friend'].sort()
      );
      assert.true(user.get('validations.isValid'));
    });

    return validations;
  });

  test('has-many relationship is async and does not exist', function (assert) {
    assert.expect(5);
    this.owner.register('validator:has-many', HasManyValidator);

    let user = setupObject(this, HasManyValidations, {
      friends: new EmberPromise((resolve) => {
        resolve();
      }),
    });

    let validations = user.get('validations').validate();
    assert.true(user.get('validations.isAsync'));
    assert.true(user.get('validations.isValidating'));

    validations.then(({ model, validations }) => {
      assert.deepEqual(model, user, 'expected model to be the correct model');
      assert.deepEqual(
        validations.get('content').getEach('attribute').sort(),
        ['friends'].sort()
      );
      assert.true(user.get('validations.isValid'));
    });

    return validations;
  });

  test('belongs-to relationship returns undefined', function (assert) {
    assert.expect(6);
    this.owner.register('validator:belongs-to', BelongsToValidator);

    let user = setupObject(this, BelongsToValidations, {
      friend: new EmberPromise((resolve) => {
        resolve({}); // validations object will be undefined
      }),
    });

    let validations = user.get('validations').validate();
    assert.true(user.get('validations.isAsync'));
    assert.true(user.get('validations.isValidating'));

    validations.then(({ model, validations }) => {
      assert.deepEqual(model, user, 'expected model to be the correct model');
      assert.deepEqual(
        validations.get('content').getEach('attribute').sort(),
        ['friend'].sort()
      );

      let friend = validations.get('content').findBy('attribute', 'friend');

      assert.false(friend.get('isValid'));
      assert.deepEqual(friend.get('message'), undefined);
    });

    return validations;
  });

  test('alias validation - simple', function (assert) {
    this.owner.register('validator:alias', AliasValidator);

    let user = setupObject(this, {
      firstName: validator('inline', { validate: Validators.presence }),
      lastName: validator('inline', { validate: Validators.presence }),
      fullName: validator('alias', 'firstName'),
    });

    user.get('validations').validateSync();

    assert.false(user.get('validations.isValid'));
    assert.false(user.get('validations.isValidating'));
    assert.false(user.get('validations.attrs.firstName.isValid'));
    assert.false(user.get('validations.attrs.fullName.isValid'));
    assert.deepEqual(
      user.get('validations.attrs.fullName.message'),
      'firstName should be present'
    );
    assert.deepEqual(
      user.get('validations.attrs.fullName.error.attribute'),
      'firstName'
    );
    assert.deepEqual(
      user.get('validations.attrs.fullName.error.parentAttribute'),
      'fullName'
    );
    assert.deepEqual(
      user.get('validations.attrs.fullName.error.message'),
      'firstName should be present'
    );

    user.set('firstName', 'Offir');

    assert.true(user.get('validations.attrs.firstName.isValid'));
    assert.true(user.get('validations.attrs.fullName.isValid'));
  });

  test('alias validation - firstMessageOnly', function (assert) {
    this.owner.register('validator:alias', AliasValidator);

    @buildValidations(
      {
        firstName: [
          validator('inline', { validate: () => 'First error message' }),
          validator('inline', { validate: () => 'Second error message' }),
        ],
        fullName: validator('alias', {
          alias: 'firstName',
          firstMessageOnly: true,
        }),
      },
      { lazy: false }
    )
    class User {}

    const user = new User();
    Object.assign(user, this.owner.ownerInjection());

    user.get('validations').validateSync();

    assert.false(user.get('validations.isValid'));
    assert.false(user.get('validations.isValidating'));
    assert.false(user.get('validations.attrs.firstName.isValid'));
    assert.deepEqual(
      user.get('validations.attrs.firstName.messages.length'),
      2
    );
    assert.false(user.get('validations.attrs.fullName.isValid'));
    assert.deepEqual(user.get('validations.attrs.fullName.messages.length'), 1);
    assert.deepEqual(
      user.get('validations.attrs.fullName.message'),
      'First error message'
    );
  });

  test('alias validation - multiple', function (assert) {
    this.owner.register('validator:alias', AliasValidator);

    @buildValidations(
      {
        firstName: validator('inline', { validate: Validators.presence }),
        lastName: validator('inline', { validate: Validators.presence }),
        fullName: [
          validator('alias', 'firstName'),
          validator('alias', 'lastName'),
        ],
      },
      { lazy: false }
    )
    class User {}

    const user = new User();
    Object.assign(user, this.owner.ownerInjection());

    user.get('validations').validateSync();

    assert.false(user.get('validations.isValid'));
    assert.false(user.get('validations.isValidating'));
    assert.false(user.get('validations.attrs.firstName.isValid'));
    assert.false(user.get('validations.attrs.lastName.isValid'));
    assert.false(user.get('validations.attrs.fullName.isValid'));
    assert.deepEqual(
      user.get('validations.attrs.fullName.messages').sort(),
      ['firstName should be present', 'lastName should be present'].sort()
    );
    assert.ok(
      emberArray(user.get('validations.attrs.fullName.errors')).isEvery(
        'parentAttribute',
        'fullName'
      )
    );

    user.set('firstName', 'Offir');

    assert.true(user.get('validations.attrs.firstName.isValid'));
    assert.false(user.get('validations.attrs.lastName.isValid'));
    assert.false(user.get('validations.attrs.fullName.isValid'));

    user.set('lastName', 'Golan');

    assert.true(user.get('validations.attrs.lastName.isValid'));
    assert.true(user.get('validations.attrs.fullName.isValid'));
  });

  test('presence on empty DS.PromiseObject', function (assert) {
    this.owner.register('validator:presence', PresenceValidator);

    let Validations = {
      friend: validator('presence', true),
    };

    let user = setupObject(this, Validations, {
      friend: PromiseObject.create(),
    });

    let { validations, model } = user.get('validations').validateSync();

    assert.deepEqual(model, user, 'expected model to be the correct model');
    assert.deepEqual(
      validations.get('content').getEach('attribute').sort(),
      ['friend'].sort()
    );

    let friend = validations.get('content').findBy('attribute', 'friend');

    assert.false(friend.get('isValid'));
    assert.deepEqual(friend.get('message'), "This field can't be blank");
  });

  test('presence on empty DS.PromiseArray', function (assert) {
    this.owner.register('validator:presence', PresenceValidator);

    let Validations = {
      friends: validator('presence', true),
    };

    let user = setupObject(this, Validations, {
      friends: PromiseArray.create(),
    });

    let { validations, model } = user.get('validations').validateSync();

    assert.deepEqual(model, user, 'expected model to be the correct model');
    assert.deepEqual(
      validations.get('content').getEach('attribute').sort(),
      ['friends'].sort()
    );

    let friends = validations.get('content').findBy('attribute', 'friends');

    assert.false(friends.get('isValid'));
    assert.deepEqual(friends.get('message'), "This field can't be blank");
  });

  test('debounce should work across nested HasMany relationships', function (assert) {
    assert.expect(8);
    this.owner.register('validator:presence', PresenceValidator);
    this.owner.register('validator:has-many', HasManyValidator);

    let done = assert.async();

    let FriendValidations = {
      name: validator('presence', { presence: true, debounce: 50 }),
    };

    let friend = setupObject(this, FriendValidations);
    let user = setupObject(this, HasManyValidations, {
      friends: new EmberPromise((resolve) => {
        resolve([friend]);
      }),
    });

    user
      .validate()
      .then(({ validations }) => {
        assert.false(
          friend.get('validations.isValidating'),
          'All promises should be resolved'
        );
        assert.false(
          user.get('validations.isValidating'),
          'All promises should be resolved'
        );
        assert.false(
          validations.get('isValidating'),
          'All promises should be resolved'
        );
        assert.false(validations.get('isValid'), 'User should not be valid');

        friend.set('name', 'Offir');
        return user.validate();
      })
      .then(({ validations }) => {
        assert.false(
          friend.get('validations.isValidating'),
          'All promises should be resolved'
        );
        assert.false(
          user.get('validations.isValidating'),
          'All promises should be resolved'
        );
        assert.false(
          validations.get('isValidating'),
          'All promises should be resolved'
        );
        assert.true(validations.get('isValid'), 'User should be valid');
        done();
      });
  });

  test('debounce should work across nested BelongsTo relationships', function (assert) {
    assert.expect(8);
    this.owner.register('validator:presence', PresenceValidator);
    this.owner.register('validator:belongs-to', BelongsToValidator);

    let done = assert.async();

    let FriendValidations = {
      name: validator('presence', { presence: true, debounce: 50 }),
    };

    let friend = setupObject(this, FriendValidations);

    let user = setupObject(this, BelongsToValidations, {
      friend: new EmberPromise((resolve) => {
        resolve(friend);
      }),
    });

    user
      .validate()
      .then(({ validations }) => {
        assert.false(
          friend.get('validations.isValidating'),
          'All promises should be resolved'
        );
        assert.false(
          user.get('validations.isValidating'),
          'All promises should be resolved'
        );
        assert.false(
          validations.get('isValidating'),
          'All promises should be resolved'
        );
        assert.false(validations.get('isValid'), 'User should not be valid');

        friend.set('name', 'Offir');
        return user.validate();
      })
      .then(({ validations }) => {
        assert.false(
          friend.get('validations.isValidating'),
          'All promises should be resolved'
        );
        assert.false(
          user.get('validations.isValidating'),
          'All promises should be resolved'
        );
        assert.false(
          validations.get('isValidating'),
          'All promises should be resolved'
        );
        assert.true(validations.get('isValid'), 'User should be valid');
        done();
      });
  });

  test('Validations should work across two-way BelongsTo relationships', function (assert) {
    assert.expect(4);
    this.owner.register('validator:presence', PresenceValidator);
    this.owner.register('validator:belongs-to', BelongsToValidator);

    let done = assert.async();

    let user2 = setupObject(this, BelongsToValidations);

    let user = setupObject(this, BelongsToValidations, {
      friend: new EmberPromise((resolve) => {
        resolve(user2);
      }),
    });

    user2.set(
      'friend',
      new EmberPromise((resolve) => {
        resolve(user);
      })
    );

    user.validate().then(({ validations }) => {
      assert.false(
        user.get('validations.isValidating'),
        'All promises should be resolved'
      );
      assert.false(
        user2.get('validations.isValidating'),
        'All promises should be resolved'
      );
      assert.false(
        validations.get('isValidating'),
        'All promises should be resolved'
      );
      assert.true(validations.get('isValid'), 'User should be valid');
      done();
    });
  });
});
