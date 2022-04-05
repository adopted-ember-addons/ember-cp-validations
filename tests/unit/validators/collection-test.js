import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

let options, builtOptions, validator, message;

module('Unit | Validator | collection', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    validator = this.owner.lookup('validator:collection');
  });

  test('buildOptions', function (assert) {
    assert.expect(2);

    options = true;
    builtOptions = validator.buildOptions(options, {});

    assert.equal(builtOptions.get('collection'), true);

    options = { collection: true };
    builtOptions = validator.buildOptions(options, {});
    assert.equal(builtOptions.get('collection'), true);
  });

  test('value is collection', function (assert) {
    assert.expect(1);

    options = { collection: true };
    builtOptions = validator.buildOptions(options);

    message = validator.validate(['foo', 'bar'], builtOptions.toObject());
    assert.equal(message, true);
  });

  test('value not collection', function (assert) {
    assert.expect(1);

    options = { collection: true };
    builtOptions = validator.buildOptions(options);

    message = validator.validate('foo', builtOptions.toObject());
    assert.equal(message, 'This field must be a collection');
  });

  test('singular - value is singular', function (assert) {
    assert.expect(1);

    options = { collection: false };
    builtOptions = validator.buildOptions(options);

    message = validator.validate('value', builtOptions.toObject());
    assert.equal(message, true);
  });

  test('singular - value not singular', function (assert) {
    assert.expect(1);

    options = { collection: false };
    builtOptions = validator.buildOptions(options);

    message = validator.validate(['foo', 'bar'], builtOptions.toObject());
    assert.equal(message, "This field can't be a collection");
  });
});
