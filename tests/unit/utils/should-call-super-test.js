import EmberObject, { computed } from '@ember/object';
import { module, test } from 'qunit';
import shouldCallSuper from 'ember-cp-validations/utils/should-call-super';

module('Unit | Utils | shouldCallSuper', function () {
  test('shouldCallSuper - true', function (assert) {
    let Parent = EmberObject.extend({
      // eslint-disable-next-line ember/require-return-from-computed
      foo: computed(function () {}),
    });

    let Child = Parent.extend({
      // eslint-disable-next-line ember/require-return-from-computed
      foo: computed(function () {
        assert.ok(shouldCallSuper(this, 'foo'));
      }),
    });

    let child = Child.create();
    child.get('foo');
  });

  test('shouldCallSuper - false', function (assert) {
    let Parent = EmberObject.extend();

    let Child = Parent.extend({
      // eslint-disable-next-line ember/require-return-from-computed
      foo: computed(function () {
        assert.ok(!shouldCallSuper(this, 'foo'));
      }),
    });

    let child = Child.create();
    child.get('foo');
  });
});
