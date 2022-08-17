import { module, test } from 'qunit';
import { flatten } from 'ember-cp-validations/utils/array';

module('Unit | Utils | array:flatten', function () {
  test('flattens an array of arrays', function (assert) {
    let result = flatten([[1], [2, 3], [4, 5]]);

    assert.deepEqual(result, [1, 2, 3, 4, 5]);
  });

  test('flattens an array of arrays of arrays ;P', function (assert) {
    let result = flatten([
      [[1], [2, 3]],
      [4, 5],
    ]);

    assert.deepEqual(result, [1, 2, 3, 4, 5]);
  });
});
