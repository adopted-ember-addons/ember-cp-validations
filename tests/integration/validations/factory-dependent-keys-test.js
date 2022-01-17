import { A } from '@ember/array';
import EmberObject from '@ember/object';
import DS from 'ember-data';
import setupObject from '../../helpers/setup-object';
import CollectionValidator from 'dummy/validators/collection';
import LengthValidator from 'dummy/validators/length';
import DSErrorValidator from 'dummy/validators/ds-error';
import { validator } from 'ember-cp-validations';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module(
  'Integration | Validations | Factory - Dependent Keys',
  function (hooks) {
    setupTest(hooks);

    test('collection validator creates correct dependent keys', function (assert) {
      this.owner.register('validator:collection', CollectionValidator);
      this.owner.register('validator:length', LengthValidator);

      let CollectionValidations = {
        array: [
          validator('collection', true),
          validator('length', {
            is: 2,
            message: 'Array must have {is} items',
          }),
        ],
      };

      let obj = setupObject(this, CollectionValidations, {
        array: A(['foo', 'bar']),
      });

      assert.true(obj.get('validations.attrs.array.isValid'));

      obj.get('array').removeObject('bar');

      assert.false(obj.get('validations.attrs.array.isValid'));
      assert.deepEqual(
        obj.get('validations.attrs.array.message'),
        'Array must have 2 items'
      );
    });

    test('ds-error validator creates correct dependent keys', function (assert) {
      this.owner.register('validator:ds-error', DSErrorValidator);
      this.owner.register('validator:length', LengthValidator);

      let DSErrorValidations = {
        username: validator('ds-error'),
      };
      let obj = setupObject(this, DSErrorValidations, {
        errors: DS.Errors.create(),
        username: '',
      });

      assert.true(obj.get('validations.attrs.username.isValid'));

      obj.get('errors').add('username', 'Username is not unique');

      assert.false(obj.get('validations.attrs.username.isValid'));
      assert.deepEqual(
        obj.get('validations.attrs.username.message'),
        'Username is not unique'
      );
    });

    test('nested ds-error validator creates correct dependent keys', function (assert) {
      this.owner.register('validator:ds-error', DSErrorValidator);
      this.owner.register('validator:length', LengthValidator);

      let DSErrorValidations = {
        'model.username': validator('ds-error'),
      };

      let obj = setupObject(this, DSErrorValidations, {
        model: EmberObject.create({
          errors: DS.Errors.create(),
          username: '',
        }),
      });

      assert.true(obj.get('validations.attrs.model.username.isValid'));

      obj.get('model.errors').add('username', 'Username is not unique');

      assert.false(obj.get('validations.attrs.model.username.isValid'));
      assert.deepEqual(
        obj.get('validations.attrs.model.username.message'),
        'Username is not unique'
      );
    });

    test('custom dependent keys - simple', function (assert) {
      let Validations = {
        fullName: validator('inline', {
          dependentKeys: ['model.firstName', 'model.lastName'],
          validate(value, options, model) {
            let firstName = model.get('firstName');
            let lastName = model.get('lastName');
            if (!firstName || !lastName) {
              return 'Full name requires first and last name';
            }
            return true;
          },
        }),
      };

      let obj = setupObject(this, Validations);

      assert.false(obj.get('validations.isValid'));
      assert.false(obj.get('validations.attrs.fullName.isValid'));
      assert.deepEqual(
        obj.get('validations.attrs.fullName.message'),
        'Full name requires first and last name'
      );

      obj.set('firstName', 'Offir');
      obj.set('lastName', 'Golan');

      assert.true(obj.get('validations.isValid'));
      assert.true(obj.get('validations.attrs.fullName.isValid'));
    });

    test('custom dependent keys - default options', function (assert) {
      let Validations = {
        fullName: {
          dependentKeys: ['model.firstName'],
          validators: [
            validator('inline', {
              dependentKeys: ['model.lastName'],
              validate(value, options, model) {
                let firstName = model.get('firstName');
                let lastName = model.get('lastName');
                if (!firstName || !lastName) {
                  return 'Full name requires first and last name';
                }
                return true;
              },
            }),
          ],
        },
      };

      let obj = setupObject(this, Validations);

      assert.false(obj.get('validations.isValid'));
      assert.false(obj.get('validations.attrs.fullName.isValid'));
      assert.deepEqual(
        obj.get('validations.attrs.fullName.message'),
        'Full name requires first and last name'
      );

      obj.set('firstName', 'Offir');
      obj.set('lastName', 'Golan');

      assert.true(obj.get('validations.isValid'));
      assert.true(obj.get('validations.attrs.fullName.isValid'));
    });

    test('custom dependent keys - nested object', function (assert) {
      let Validations = {
        page: validator('inline', {
          validate(value, options, model) {
            let currPage = model.get('currPage');
            let lastPage = model.get('meta.pages.last');
            if (currPage > lastPage) {
              return 'Cannot exceed max page';
            }
            return true;
          },
        }),
      };

      let obj = setupObject(this, Validations, {
        meta: {
          pages: {
            last: 5,
          },
        },
        currPage: 4,
      });

      assert.true(obj.get('validations.isValid'));
      assert.true(obj.get('validations.attrs.page.isValid'));

      obj.set('currPage', 6);

      assert.false(obj.get('validations.isValid'));
      assert.false(obj.get('validations.attrs.page.isValid'));
      assert.deepEqual(
        obj.get('validations.attrs.page.message'),
        'Cannot exceed max page'
      );

      obj.set('meta.pages.last', 7);

      assert.true(obj.get('validations.isValid'));
      assert.true(obj.get('validations.attrs.page.isValid'));
    });

    test('custom dependent keys - array', function (assert) {
      let Validations = {
        friends: validator('inline', {
          validate(value, options, model) {
            let friends = model.get('friends');
            if (!friends || friends.length === 0) {
              return 'User must have a friend';
            }
            return true;
          },
        }),
      };

      let obj = setupObject(this, Validations, {
        friends: A(),
      });

      assert.false(obj.get('validations.isValid'));
      assert.false(obj.get('validations.attrs.friends.isValid'));
      assert.deepEqual(
        obj.get('validations.attrs.friends.message'),
        'User must have a friend'
      );

      obj.get('friends').pushObject('Offir');

      assert.true(obj.get('validations.isValid'));
      assert.true(obj.get('validations.attrs.friends.isValid'));

      obj.get('friends').removeObject('Offir');

      assert.false(obj.get('validations.isValid'));
      assert.false(obj.get('validations.attrs.friends.isValid'));
      assert.deepEqual(
        obj.get('validations.attrs.friends.message'),
        'User must have a friend'
      );
    });

    test('custom dependent keys - array of objects', function (assert) {
      let Validations = {
        friends: validator('inline', {
          validate(value, options, model) {
            let friends = model.get('friends');
            if (!friends || friends.length === 0) {
              return 'User must have a friend';
            } else if (friends.length > 0) {
              let names = friends.filter((f) => f.name);
              if (names.length !== friends.length) {
                return 'All friends must have a name';
              }
            }
            return true;
          },
        }),
      };

      let obj = setupObject(this, Validations, {
        friends: A(),
      });

      assert.false(obj.get('validations.isValid'));
      assert.false(obj.get('validations.attrs.friends.isValid'));
      assert.deepEqual(
        obj.get('validations.attrs.friends.message'),
        'User must have a friend'
      );

      obj.get('friends').pushObject(
        EmberObject.create({
          name: 'Offir',
        })
      );

      assert.true(obj.get('validations.isValid'));
      assert.true(obj.get('validations.attrs.friends.isValid'));

      obj.get('friends.0').set('name', undefined);

      assert.false(obj.get('validations.isValid'));
      assert.false(obj.get('validations.attrs.friends.isValid'));
      assert.deepEqual(
        obj.get('validations.attrs.friends.message'),
        'All friends must have a name'
      );
    });
  }
);
