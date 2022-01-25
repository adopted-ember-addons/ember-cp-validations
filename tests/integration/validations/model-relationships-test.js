import { isNone } from '@ember/utils';
import { A as emberArray } from '@ember/array';
// eslint-disable-next-line ember/use-ember-data-rfc-395-imports
import DefaultMessages from 'dummy/validators/messages';
import BelongsToValidator from 'ember-cp-validations/validators/belongs-to';
import HasManyValidator from 'ember-cp-validations/validators/has-many';
import AliasValidator from 'ember-cp-validations/validators/alias';
import { validator, buildValidations } from 'ember-cp-validations';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { tracked } from '@glimmer/tracking';

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

class ObjClassBase {
  @tracked firstName;
  @tracked lastName;

  constructor(owner, props = {}) {
    Object.assign(this, owner.ownerInjection(), props);
  }
}

@buildValidations(Validations)
class ObjClass extends ObjClassBase {}

@buildValidations(BelongsToValidations)
class BelongsToClass extends ObjClassBase {
  @tracked friend;
}

@buildValidations(HasManyValidations)
class HasManyClass extends ObjClassBase {
  @tracked friends = [];
}

module('Integration | Validations | Model Relationships', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('validator:messages', DefaultMessages);
  });

  test('belong to validation - no cycle', function (assert) {
    this.owner.register('validator:belongs-to', BelongsToValidator);

    let user2 = new ObjClass(this.owner, {
      firstName: 'John',
    });

    let user = new BelongsToClass(this.owner, {
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
    assert.deepEqual(friend.message, 'lastName should be present');
  });

  test('belong to validation - with cycle', function (assert) {
    this.owner.register('validator:belongs-to', BelongsToValidator);

    let user = new BelongsToClass(this.owner);
    user.friend = user;

    let { validations, model } = user.validations.validate();

    assert.deepEqual(model, user, 'expected model to be the correct model');
    assert.deepEqual(
      validations.content.mapBy('attribute').sort(),
      ['friend'].sort()
    );

    let friend = validations.content.findBy('attribute', 'friend');

    assert.true(friend.isValid);
    assert.deepEqual(friend.message, undefined);
  });

  test('has-many relationship is sync', function (assert) {
    this.owner.register('validator:has-many', HasManyValidator);

    let friend = new ObjClass(this.owner, {
      firstName: 'John',
    });

    let user = new HasManyClass(this.owner, {
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

  test('alias validation - simple', function (assert) {
    this.owner.register('validator:alias', AliasValidator);

    @buildValidations({
      firstName: validator('inline', { validate: Validators.presence }),
      lastName: validator('inline', { validate: Validators.presence }),
      fullName: validator('alias', 'firstName'),
    })
    class ObjClass extends ObjClassBase {}

    let user = new ObjClass(this.owner);

    user.validations.validate();

    assert.false(user.validations.isValid);
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

    user.firstName = 'Offir';

    assert.true(user.validations.attrs.firstName.isValid);
    assert.true(user.validations.attrs.fullName.isValid);
  });

  test('alias validation - firstMessageOnly', function (assert) {
    this.owner.register('validator:alias', AliasValidator);

    @buildValidations({
      firstName: [
        validator('inline', { validate: () => 'First error message' }),
        validator('inline', { validate: () => 'Second error message' }),
      ],
      fullName: validator('alias', {
        alias: 'firstName',
        firstMessageOnly: true,
      }),
    })
    class User extends ObjClassBase {}

    const user = new User(this.owner);

    user.validations.validate();

    assert.false(user.validations.isValid);
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

    @buildValidations({
      firstName: validator('inline', { validate: Validators.presence }),
      lastName: validator('inline', { validate: Validators.presence }),
      fullName: [
        validator('alias', 'firstName'),
        validator('alias', 'lastName'),
      ],
    })
    class User extends ObjClassBase {}

    const user = new User(this.owner);

    user.validations.validate();

    assert.false(user.validations.isValid);
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

    user.firstName = 'Offir';

    assert.true(user.validations.attrs.firstName.isValid);
    assert.false(user.validations.attrs.lastName.isValid);
    assert.false(user.validations.attrs.fullName.isValid);

    user.lastName = 'Golan';

    assert.true(user.validations.attrs.lastName.isValid);
    assert.true(user.validations.attrs.fullName.isValid);
  });
});
