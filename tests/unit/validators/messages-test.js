/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import { moduleFor, test } from 'ember-qunit';

let messages;

moduleFor('validator:messages', 'Unit | Validator | messages', {
  setup() {
    messages = this.subject();
  }
});

test('message strings present', function(assert) {
  assert.expect(2);
  assert.equal(messages.get('invalid'), '{description} is invalid');
  assert.equal(
    messages.get('tooShort'),
    '{description} is too short (minimum is {min} characters)'
  );
});

test('formatMessage', function(assert) {
  assert.expect(3);
  let context = {
    description: 'This field'
  };
  assert.equal(
    messages.formatMessage(undefined, context),
    'This field is invalid'
  );
  assert.equal(
    messages.formatMessage('{foo} is undefined'),
    'undefined is undefined'
  );
  assert.equal(
    messages.formatMessage('{foo} {foo} {bar} {baz}', {
      foo: 'a',
      bar: 1,
      baz: 'abc'
    }),
    'a a 1 abc'
  );
});

test('getMessageFor', function(assert) {
  assert.expect(2);
  let context = {
    description: 'This field',
    min: 4
  };
  assert.equal(messages.getMessageFor('foo', context), 'This field is invalid');
  assert.equal(
    messages.getMessageFor('tooShort', context),
    'This field is too short (minimum is 4 characters)'
  );
});
