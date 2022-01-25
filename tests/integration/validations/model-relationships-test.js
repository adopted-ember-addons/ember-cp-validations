import ArrayProxy from '@ember/array/proxy';
import { isNone } from '@ember/utils';
import { A as emberArray } from '@ember/array';
// eslint-disable-next-line ember/use-ember-data-rfc-395-imports
import setupObject from '../../helpers/setup-object';
import DefaultMessages from 'dummy/validators/messages';
import BelongsToValidator from 'ember-cp-validations/validators/belongs-to';
import HasManyValidator from 'ember-cp-validations/validators/has-many';
import AliasValidator from 'ember-cp-validations/validators/alias';
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

    let { validations, model } = user.validations.validate();

    assert.deepEqual(model, user, 'expected model to be the correct model');
    assert.deepEqual(
      validations.content.mapBy('attribute').sort(),
      ['friend'].sort()
    );

    let friend = validations.content.findBy('attribute', 'friend');

    assert.false(friend.isValid);
    assert.false(friend.isValidating);
    assert.deepEqual(friend.message, 'lastName should be present');
  });

  test('belong to validation - with cycle', function (assert) {
    this.owner.register('validator:belongs-to', BelongsToValidator);

    let user = setupObject(this, BelongsToValidations);
    user.set('friend', user);

    let { validations, model } = user.validations.validate();

    assert.deepEqual(model, user, 'expected model to be the correct model');
    assert.deepEqual(
      validations.content.mapBy('attribute').sort(),
      ['friend'].sort()
    );

    let friend = validations.content.findBy('attribute', 'friend');

    assert.true(friend.isValid);
    assert.false(friend.isValidating);
    assert.deepEqual(friend.message, undefined);
  });

  test('has-many relationship is sync', function (assert) {
    this.owner.register('validator:has-many', HasManyValidator);

    let friend = setupObject(this, Validations, {
      firstName: 'John',
    });

    let user = setupObject(this, HasManyValidations, {
      friends: [friend],
    });

    let { validations, model } = user.validations.validate();

    assert.deepEqual(model, user, 'expected model to be the correct model');
    assert.deepEqual(
      validations.content.mapBy('attribute').sort(),
      ['friends'].sort()
    );

    let friends = validations.content.findBy('attribute', 'friends');

    assert.false(friends.isValid);
    assert.deepEqual(friends.message, 'lastName should be present');
  });

  test('has-many relationship is sync with proxy', function (assert) {
    this.owner.register('validator:has-many', HasManyValidator);

    let friend = setupObject(this, Validations, {
      firstName: 'John',
    });

    let user = setupObject(this, HasManyValidations, {
      friends: ArrayProxy.create({ content: emberArray([friend]) }),
    });

    let { validations, model } = user.validations.validate();

    assert.deepEqual(model, user, 'expected model to be the correct model');
    assert.deepEqual(
      validations.content.mapBy('attribute').sort(),
      ['friends'].sort()
    );

    let friends = validations.content.findBy('attribute', 'friends');

    assert.false(friends.isValid);
    assert.deepEqual(friends.message, 'lastName should be present');
  });

  test('alias validation - simple', function (assert) {
    this.owner.register('validator:alias', AliasValidator);

    let user = setupObject(this, {
      firstName: validator('inline', { validate: Validators.presence }),
      lastName: validator('inline', { validate: Validators.presence }),
      fullName: validator('alias', 'firstName'),
    });

    user.validations.validate();

    assert.false(user.validations.isValid);
    assert.false(user.validations.isValidating);
    assert.false(user.validations.attrs.firstName.isValid);
    assert.false(user.validations.attrs.fullName.isValid);
    assert.deepEqual(
      user.validations.attrs.fullName.message,
      'firstName should be present'
    );
    assert.deepEqual(
      user.validations.attrs.fullName.error.attribute,
      'firstName'
    );
    assert.deepEqual(
      user.validations.attrs.fullName.error.parentAttribute,
      'fullName'
    );
    assert.deepEqual(
      user.validations.attrs.fullName.error.message,
      'firstName should be present'
    );

    user.set('firstName', 'Offir');

    assert.true(user.validations.attrs.firstName.isValid);
    assert.true(user.validations.attrs.fullName.isValid);
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

    user.validations.validate();

    assert.false(user.validations.isValid);
    assert.false(user.validations.isValidating);
    assert.false(user.validations.attrs.firstName.isValid);
    assert.deepEqual(user.validations.attrs.firstName.messages.length, 2);
    assert.false(user.validations.attrs.fullName.isValid);
    assert.deepEqual(user.validations.attrs.fullName.messages.length, 1);
    assert.deepEqual(
      user.validations.attrs.fullName.message,
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

    user.validations.validate();

    assert.false(user.validations.isValid);
    assert.false(user.validations.isValidating);
    assert.false(user.validations.attrs.firstName.isValid);
    assert.false(user.validations.attrs.lastName.isValid);
    assert.false(user.validations.attrs.fullName.isValid);
    assert.deepEqual(
      user.validations.attrs.fullName.messages.sort(),
      ['firstName should be present', 'lastName should be present'].sort()
    );
    assert.ok(
      emberArray(user.validations.attrs.fullName.errors).isEvery(
        'parentAttribute',
        'fullName'
      )
    );

    user.set('firstName', 'Offir');

    assert.true(user.validations.attrs.firstName.isValid);
    assert.false(user.validations.attrs.lastName.isValid);
    assert.false(user.validations.attrs.fullName.isValid);

    user.set('lastName', 'Golan');

    assert.true(user.validations.attrs.lastName.isValid);
    assert.true(user.validations.attrs.fullName.isValid);
  });
});
