/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import Registry from '../../helpers/registry';
import {
  moduleFor, test
}
from 'ember-qunit';

var messages, container, registry;

moduleFor('validator:messages', 'Unit | Validator | messages', {
  setup: function() {
    registry = new Registry();
    container = registry.get('container');
    messages = this.subject({
      container
    });
  }
});

test('message strings present', function(assert) {
  assert.expect(2);
  assert.equal(messages.get('invalid'), 'is invalid');
  assert.equal(messages.get('tooShort'), 'is too short (minimum is {count} characters)');
});

test('formatMessage', function(assert) {
  assert.expect(3);
  assert.equal(messages.formatMessage(), 'is invalid');
  assert.equal(messages.formatMessage('{foo} is undefined'), 'undefined is undefined');
  assert.equal(messages.formatMessage('{foo} {foo} {bar} {baz}', {foo: 'a', bar: 1, baz: 'abc'}), 'a a 1 abc');
});

test('getMessageFor', function(assert) {
  assert.expect(3);
  assert.equal(messages.getMessageFor('foo'), 'is invalid');
  assert.equal(messages.getMessageFor('tooShort'), 'is too short (minimum is undefined characters)');
  assert.equal(messages.getMessageFor('tooShort', {count: 4}), 'is too short (minimum is 4 characters)');
});
