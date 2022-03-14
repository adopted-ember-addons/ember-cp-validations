import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Validator | inline', function(hooks) {
  setupTest(hooks);

  test('no options', function(assert) {
    assert.expect(1);

    try {
      this.owner.lookup('validator:inline');
    } catch (e) {
      assert.ok(true);
    }
  });

  test('it works', function(assert) {
    assert.expect(3);

     const ValidatorClass = typeof this.owner.factoryFor === 'function'
      ? this.owner.factoryFor('validator:inline')
      : this.owner.resolveRegistration('validator:inline');

    const validator = ValidatorClass.create({
        options: {
          foo: 'bar',
          validate(value, options) {
            assert.equal(this, validator, 'Context is preserved');
            assert.equal(options.foo, 'bar', 'It receives options');
            assert.notOk(
              options.validate,
              'Validate fn removed from the options'
            );
          },
        },
      });

    validator.validate('foo', validator.get('options').toObject());
  });
});
