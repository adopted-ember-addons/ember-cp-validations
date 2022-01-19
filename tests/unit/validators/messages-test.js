import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

let messages;

module('Unit | Validator | messages', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    messages = this.owner.lookup('validator:messages');
  });

  test('message strings present', function (assert) {
    assert.expect(2);
    assert.deepEqual(messages.invalid, '{description} is invalid');
    assert.deepEqual(
      messages.tooShort,
      '{description} is too short (minimum is {min} characters)'
    );
  });

  test('formatMessage', function (assert) {
    assert.expect(3);
    let context = {
      description: 'This field',
    };
    assert.deepEqual(
      messages.formatMessage(undefined, context),
      'This field is invalid'
    );
    assert.deepEqual(
      messages.formatMessage('{foo} is undefined'),
      'undefined is undefined'
    );
    assert.deepEqual(
      messages.formatMessage('{foo} {foo} {bar} {baz}', {
        foo: 'a',
        bar: 1,
        baz: 'abc',
      }),
      'a a 1 abc'
    );
  });

  test('getMessageFor', function (assert) {
    assert.expect(2);
    let context = {
      description: 'This field',
      min: 4,
    };
    assert.deepEqual(
      messages.getMessageFor('foo', context),
      'This field is invalid'
    );
    assert.deepEqual(
      messages.getMessageFor('tooShort', context),
      'This field is too short (minimum is 4 characters)'
    );
  });
});
