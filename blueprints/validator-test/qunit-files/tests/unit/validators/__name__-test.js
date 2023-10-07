import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Validator | <%= dasherizedModuleName %>', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    const validator = this.owner.lookup(
      'validator:<%= dasherizedModuleName %>',
    );
    assert.ok(validator);
  });
});
