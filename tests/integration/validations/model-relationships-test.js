import { isNone } from '@ember/utils';
// eslint-disable-next-line ember/use-ember-data-rfc-395-imports
import DefaultMessages from 'dummy/validators/messages';
import BelongsToValidator from 'ember-cp-validations/validators/belongs-to';
import HasManyValidator from 'ember-cp-validations/validators/has-many';
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
});
