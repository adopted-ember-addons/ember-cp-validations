import { moduleFor, test } from 'ember-qunit';

moduleFor('validator:inline', 'Unit | Validator | inline');

test('no options', function(assert) {
  assert.expect(1);

  try {
    this.subject();
  } catch (e) {
    assert.ok(true);
  }
});

test('it works', function(assert) {
  assert.expect(3);

  const validator = this.subject({
    options: {
      foo: 'bar',
      validate(value, options) {
        assert.equal(this, validator, 'Context is preserved');
        assert.equal(options.foo, 'bar', 'It receives options');
        assert.notOk(options.validate, 'Validate fn removed from the options');
      }
    }
  });

  validator.validate('foo', validator.get('options').toObject());
});
