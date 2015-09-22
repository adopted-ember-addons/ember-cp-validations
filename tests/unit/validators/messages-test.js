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

var GenericI18n = Ember.Service.extend({
  exists(key) {
    key = key.split('.')[1];
    return messages.get(key);
  },
  t(key, context) {
    return 'I18n: ' + messages.formatMessage(this.exists(key), context);
  },
  formatMessage(key, context) {
    return 'Intl: ' + messages.formatMessage(key, context);
  }
});

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

test('getMessageFor - defaults', function(assert) {
  assert.expect(3);
  assert.equal(messages.getMessageFor('foo'), 'is invalid');
  assert.equal(messages.getMessageFor('tooShort'), 'is too short (minimum is undefined characters)');
  assert.equal(messages.getMessageFor('tooShort', {count: 4}), 'is too short (minimum is 4 characters)');
});

test('getMessageFor - i18n', function(assert) {
  assert.expect(3);
  registry.register('service:i18n', GenericI18n);
  assert.equal(messages.getMessageFor('foo'), 'is invalid');
  assert.equal(messages.getMessageFor('tooShort'), 'I18n: is too short (minimum is undefined characters)');
  assert.equal(messages.getMessageFor('tooShort', {count: 4}), 'I18n: is too short (minimum is 4 characters)');
});

test('getMessageFor - intl', function(assert) {
  assert.expect(3);
  registry.register('service:intl', GenericI18n);
  assert.equal(messages.getMessageFor('foo'), 'is invalid');
  assert.equal(messages.getMessageFor('tooShort'), 'Intl: is too short (minimum is undefined characters)');
  assert.equal(messages.getMessageFor('tooShort', {count: 4}), 'Intl: is too short (minimum is 4 characters)');
});
