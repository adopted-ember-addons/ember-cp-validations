/**
 * Copyright 2015, Yahoo! Inc.
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
  assert.deepEqual(options, { foo: 'a', bar: 'b'});
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
  assert.deepEqual(options, { foo: 'a', bar: 'b'});
});

test('processOptions - calls functions', function(assert) {
  assert.expect(2);

  options = {
    foo() { return 'a'; },
    message() {
      return "has some sort of error";
    }
  };

  validator.set('options', options);
  options = validator.processOptions();
  assert.equal(options.foo, 'a');
  assert.equal(typeof options.message, 'function', 'message function should only be called by createErrorMessage');
});

test('createErrorMessage - message function', function(assert) {
  assert.expect(1);

  options = {
    message() {
      return "has some sort of error";
    }
  };

  message = validator.createErrorMessage(undefined, options);
  assert.equal(message, 'This field has some sort of error');
});
