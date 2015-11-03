/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import {
  moduleFor, test
}
from 'ember-qunit';

var options, validator, message;
var set = Ember.set;

moduleFor('validator:number', 'Unit | Validator | number', {
  needs: ['validator:messages'],
  setup: function() {
    validator = this.subject();
  }
});

test('no options', function(assert) {
  assert.expect(2);

  message = validator.validate(undefined, {});
  assert.equal(message, 'This field must be a number');

  message = validator.validate(22, {});
  assert.equal(message, true);
});

test('allow string', function(assert) {
  assert.expect(6);

  options = {
    allowString: true
  };

  message = validator.validate('22', options);
  assert.equal(message, true);

  message = validator.validate('22.22', options);
  assert.equal(message, true);

  message = validator.validate('test', options);
  assert.equal(message, 'This field must be a number');

  message = validator.validate('', options);
  assert.equal(message, 'This field must be a number');

  options.allowString = false;

  message = validator.validate('22', options);
  assert.equal(message, 'This field must be a number');

  message = validator.validate('22.22', options);
  assert.equal(message, 'This field must be a number');


});

test('integer', function(assert) {
  assert.expect(3);

  options = {
    integer: true
  };

  message = validator.validate(22, options);
  assert.equal(message, true);

  message = validator.validate(22.22, options);
  assert.equal(message, 'This field must be an integer');

  message = validator.validate(-2.2, options);
  assert.equal(message, 'This field must be an integer');
});

test('is', function(assert) {
  assert.expect(2);

  options = {
    is: 22
  };

  message = validator.validate(1, options);
  assert.equal(message, 'This field must be equal to 22');

  message = validator.validate(22, options);
  assert.equal(message, true);
});

test('lt', function(assert) {
  assert.expect(3);

  options = {
    lt: 22
  };

  message = validator.validate(21, options);
  assert.equal(message, true);

  message = validator.validate(22, options);
  assert.equal(message, 'This field must be less than 22');

  message = validator.validate(23, options);
  assert.equal(message, 'This field must be less than 22');
});

test('lte', function(assert) {
  assert.expect(3);

  options = {
    lte: 22
  };

  message = validator.validate(21, options);
  assert.equal(message, true);

  message = validator.validate(22, options);
  assert.equal(message, true);

  message = validator.validate(23, options);
  assert.equal(message, 'This field must be less than or equal to 22');
});

test('gt', function(assert) {
  assert.expect(3);

  options = {
    gt: 22
  };

  message = validator.validate(21, options);
  assert.equal(message, 'This field must be greater than 22');

  message = validator.validate(22, options);
  assert.equal(message, 'This field must be greater than 22');

  message = validator.validate(23, options);
  assert.equal(message, true);
});

test('gte', function(assert) {
  assert.expect(3);

  options = {
    gte: 22
  };

  message = validator.validate(21, options);
  assert.equal(message, 'This field must be greater than or equal to 22');

  message = validator.validate(22, options);
  assert.equal(message, true);

  message = validator.validate(23, options);
  assert.equal(message, true);
});

test('positive', function(assert) {
  assert.expect(4);

  options = {
    positive: true
  };

  message = validator.validate(-1, options);
  assert.equal(message, 'This field must be positive');

  message = validator.validate(-144, options);
  assert.equal(message, 'This field must be positive');

  message = validator.validate(0, options);
  assert.equal(message, true);

  message = validator.validate(22, options);
  assert.equal(message, true);
});

test('odd', function(assert) {
  assert.expect(4);

  options = {
    odd: true
  };

  message = validator.validate(22, options);
  assert.equal(message, 'This field must be odd');

  message = validator.validate(-144, options);
  assert.equal(message, 'This field must be odd');

  message = validator.validate(21, options);
  assert.equal(message, true);

  message = validator.validate(-21, options);
  assert.equal(message, true);
});

test('even', function(assert) {
  assert.expect(5);

  options = {
    even: true
  };

  message = validator.validate(22, options);
  assert.equal(message, true);

  message = validator.validate(-22, options);
  assert.equal(message, true);

  message = validator.validate(22.22, options);
  assert.equal(message, 'This field must be even');

  message = validator.validate(21, options);
  assert.equal(message, 'This field must be even');

  message = validator.validate(-33, options);
  assert.equal(message, 'This field must be even');
});

test('allowBlank', function(assert) {
  assert.expect(3);

  options = {
    allowBlank: true
  };

  message = validator.validate(null, options);
  assert.equal(message, true);

  message = validator.validate(undefined, options);
  assert.equal(message, true);

  message = validator.validate('', options);
  assert.equal(message, true);
});
