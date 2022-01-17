import { module, test } from 'qunit';
import deepSet from 'ember-cp-validations/utils/deep-set';

module('Unit | Utils | deepSet', function () {
  test('single level', function (assert) {
    let obj = {};
    deepSet(obj, 'foo.bar', 1);
    assert.deepEqual(obj, { foo: { bar: 1 } });
  });

  test('multi level', function (assert) {
    let obj = {};
    deepSet(obj, 'foo.bar.baz.boo', 1);
    assert.deepEqual(obj, { foo: { bar: { baz: { boo: 1 } } } });
  });
});
