/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import BaseValidator from 'ember-cp-validations/validators/base';
import {
  moduleFor, test
}
from 'ember-qunit';

var defaultOptions, options, validator, message;
var set = Ember.set;

moduleFor('validator:length', 'Unit | Validator | base', {
  needs: ['validator:messages'],
  setup: function() {
    validator = BaseValidator.create();
  }
});

test('buildOptions - merge all options', function(assert) {
  assert.expect(1);

  options = {
    foo: 'a'
  };

  defaultOptions = {
    bar: 'b'
  };

  options = validator.buildOptions(options, defaultOptions);
  assert.deepEqual(options.getProperties(['foo', 'bar']), { foo: 'a', bar: 'b'});
});

test('buildOptions - does not overwrite options', function(assert) {
  assert.expect(1);

  options = {
    foo: 'a',
    bar: 'b'
  };

  defaultOptions = {
    bar: 'c'
  };

  options = validator.buildOptions(options, defaultOptions);
  assert.deepEqual(options.getProperties(['foo', 'bar']), { foo: 'a', bar: 'b'});
});

test('buildOptions - returned options are frozen', function(assert) {
  assert.expect(1);

  options = {
    foo: 'a'
  };

  options = validator.buildOptions(options);

  try {
    options.set('foo', 'bar');
  } catch (e) {
    assert.ok(true);
  }
});

test('createErrorMessage - message function', function(assert) {
  assert.expect(1);

  options = {
    message() {
      return "{description} has some sort of error";
    }
  };

  message = validator.createErrorMessage(undefined, undefined, options);
  assert.equal(message, 'This field has some sort of error');
});


test('value - default gets model value', function(assert) {
  assert.expect(2);

  validator.setProperties({
    model: Ember.Object.create({ foo: 'bar'}),
    attribute: 'foo',
    options: {}
  });

  validator.init();

  assert.equal(validator.get('attribute'), 'foo');
  assert.equal(validator.getValue(), 'bar');
});

test('value - overwrite value method via options', function(assert) {
  assert.expect(3);

  validator.setProperties({
    model: Ember.Object.create({ foo: 'bar', bar: 'baz'}),
    attribute: 'foo',
    options: {
      value() {
        return this.get('model.bar');
      }
    }
  });

  validator.init();

  assert.equal(validator.get('attribute'), 'foo');
  assert.equal(validator.getValue(), 'baz');
  assert.notOk(validator.get('options.value'));
});

test('message - handles SafeString', function(assert) {
  assert.expect(1);

  options = {
    message: Ember.String.htmlSafe('should be more than &euro;15')
  };

  message = validator.createErrorMessage(undefined, undefined, options);
  assert.equal(message, 'should be more than &euro;15');
});
