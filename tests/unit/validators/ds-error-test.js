import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

let model, validator, message;

module('Unit | Validator | ds-error', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    validator = this.owner.lookup('validator:ds-error');
  });

  test('works with empty object', function (assert) {
    assert.expect(1);

    model = EmberObject.create();

    message = validator.validate(undefined, undefined, model, 'username');
    assert.true(message);
  });

  test('it works', function (assert) {
    assert.expect(2);

    let model = this.owner.lookup('service:store').createRecord('user');

    message = validator.validate(undefined, undefined, model, 'username');
    assert.true(message);

    model.get('errors').add('username', 'Username is not unique');

    message = validator.validate(undefined, undefined, model, 'username');
    assert.strictEqual(message, 'Username is not unique');
  });

  test('gets last message', function (assert) {
    assert.expect(2);

    let model = this.owner.lookup('service:store').createRecord('user');

    message = validator.validate(undefined, undefined, model, 'username');
    assert.true(message);

    model.get('errors').add('username', 'Username is not unique');
    model.get('errors').add('username', 'Username is too long');

    message = validator.validate(undefined, undefined, model, 'username');
    assert.strictEqual(message, 'Username is too long');
  });
});
