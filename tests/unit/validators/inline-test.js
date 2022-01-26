import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Validator | inline', function (hooks) {
  setupTest(hooks);

  test('it works', function (assert) {
    assert.expect(2);

    const validator = this.owner.factoryFor('validator:inline').create({
      options: {
        foo: 'bar',
        validate(value, options) {
          assert.deepEqual(this, validator, 'Context is preserved');
          assert.deepEqual(options.foo, 'bar', 'It receives options');
        },
      },
    });

    validator.validate('foo', validator.options.toObject());
  });
});
