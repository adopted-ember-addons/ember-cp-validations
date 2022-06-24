import EmberObject, { computed } from '@ember/object';
import { module, test } from 'qunit';
import shouldCallSuper from 'ember-cp-validations/utils/should-call-super';

module('Unit | Utils | shouldCallSuper', function () {
  test('shouldCallSuper - true', function (assert) {
    let Parent = EmberObject.extend({
      foo: computed(function () {
        return null;
      }),
    });

    let Child = Parent.extend({
      foo: computed(function () {
        assert.ok(shouldCallSuper(this, 'foo'));
        return null;
      }),
    });

    let child = Child.create();
    child.get('foo');
  });

  test('shouldCallSuper - false', function (assert) {
    let Parent = EmberObject.extend();

    let Child = Parent.extend({
      foo: computed(function () {
        assert.notOk(shouldCallSuper(this, 'foo'));
        return null;
      }),
    });

    let child = Child.create();
    child.get('foo');
  });
});
