import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Validator | inline', function (hooks) {
  setupTest(hooks);

  test('no options', function (assert) {
    assert.expect(1);

    try {
      this.owner.lookup('validator:inline');
    } catch (e) {
      assert.ok(true);
    }
  });

  test('it works', function (assert) {
    assert.expect(3);

    const validator = this.owner.factoryFor('validator:inline').create({
      options: {
        foo: 'bar',
        validate(value, options) {
          assert.strictEqual(this, validator, 'Context is preserved');
          assert.strictEqual(options.foo, 'bar', 'It receives options');
          assert.notOk(
            options.validate,
            'Validate fn removed from the options',
          );
        },
      },
    });

    validator.validate('foo', validator.get('options').toObject());
  });
});
