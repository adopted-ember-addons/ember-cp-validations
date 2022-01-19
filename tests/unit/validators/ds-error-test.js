// eslint-disable-next-line ember/use-ember-data-rfc-395-imports
import DS from 'ember-data';
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

    model = {};

    message = validator.validate(undefined, undefined, model, 'username');
    assert.true(message);
  });

  test('it works', function (assert) {
    assert.expect(2);

    model = {
      errors: DS.Errors.create(),
      username: null,
    };

    message = validator.validate(undefined, undefined, model, 'username');
    assert.true(message);

    model.errors.add('username', 'Username is not unique');

    message = validator.validate(undefined, undefined, model, 'username');
    assert.deepEqual(message, 'Username is not unique');
  });

  test('gets last message', function (assert) {
    assert.expect(2);

    model = {
      errors: DS.Errors.create(),
      username: null,
    };

    message = validator.validate(undefined, undefined, model, 'username');
    assert.true(message);

    model.errors.add('username', 'Username is not unique');
    model.errors.add('username', 'Username is too long');

    message = validator.validate(undefined, undefined, model, 'username');
    assert.deepEqual(message, 'Username is too long');
  });
});
