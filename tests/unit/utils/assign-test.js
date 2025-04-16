import EmberObject, { computed } from '@ember/object';
import { module, test } from 'qunit';
import deepSet from 'ember-cp-validations/utils/deep-set';

module('Unit | Utils | deepSet', function () {
  test('single level', function (assert) {
    let obj = {};
    deepSet(obj, 'foo.bar', 1);
    assert.deepEqual(obj, { foo: { bar: 1 } });
  });

  test('single level - ember object', function (assert) {
    let obj = EmberObject.create();
    deepSet(obj, 'foo.bar', 1, true);
    assert.ok(obj.foo instanceof EmberObject);
    assert.strictEqual(obj.get('foo.bar'), 1);
  });

  test('single level - ember object w/ CP', function (assert) {
    let obj = EmberObject.create();
    deepSet(
      obj,
      'foo.bar',
      computed(function () {
        return 1;
      }),
      true,
    );
    assert.ok(obj.foo instanceof EmberObject);
    assert.strictEqual(obj.get('foo.bar'), 1);
  });

  test('multi level', function (assert) {
    let obj = {};
    deepSet(obj, 'foo.bar.baz.boo', 1);
    assert.deepEqual(obj, { foo: { bar: { baz: { boo: 1 } } } });
  });

  test('multi level - ember object', function (assert) {
    let obj = EmberObject.create();
    deepSet(obj, 'foo.bar.baz.boo', 1, true);
    assert.ok(obj.foo.bar.baz instanceof EmberObject);
    assert.strictEqual(obj.get('foo.bar.baz.boo'), 1);
  });
});
