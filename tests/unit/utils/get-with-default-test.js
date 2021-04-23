import { module, test } from 'qunit';
import getWithDefault from 'ember-cp-validations/utils/get-with-default';

module('Unit | Utils | get with default', function() {
  test('return the default value when value is undefined', function(assert) {
    const undefinedObj = {
      foo: undefined
    };
    const defaultValue = 'something';
    let result = getWithDefault(undefinedObj, 'foo', defaultValue);

    assert.equal(result, defaultValue);
  });

  test('return the correct value if defined', function(assert) {
    const obj = {
      yehuda: 'katz'
    };

    const defaultValue = 'something';
    let result = getWithDefault(obj, 'yehuda', defaultValue);

    assert.equal(result, 'katz');
  });
});
