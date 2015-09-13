import { moduleFor, test } from 'ember-qunit';

moduleFor('validator:<%= dasherizedModuleName %>', 'Unit | Validator | <%= dasherizedModuleName %>', {
  needs: ['validator:messages']
});

test('it works', function(assert) {
  var validator = this.subject();
  assert.ok(validator);
});
