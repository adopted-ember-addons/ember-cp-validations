/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import moment from 'moment';

import {
  moduleFor, test
}
from 'ember-qunit';

var options, validator, message;
var set = Ember.set;
const assign = Ember.assign || Ember.merge;

moduleFor('validator:date', 'Unit | Validator | date', {
  needs: ['validator:messages'],
  setup: function() {
    validator = this.subject();
  }
});

test('no options', function(assert) {
  assert.expect(1);

  options = {};
  message = validator.validate(undefined, options);
  assert.equal(message, true);
});

test('allow blank', function(assert) {
  assert.expect(2);

  options = {
    allowBlank: true,
    before: '1/1/2015'
  };

  message = validator.validate('', assign({}, options));
  assert.equal(message, true);

  message = validator.validate('1/1/2016', assign({}, options));
  assert.equal(message, 'This field must be before Jan 1st, 2015');
});

test('valid date', function(assert) {
  assert.expect(2);

  options = {};

  message = validator.validate('abc', assign({}, options));
  assert.equal(message, 'This field must be a valid date');

  message = validator.validate(new Date(), assign({}, options));
  assert.equal(message, true);
});

test('valid input date format', function(assert) {
  assert.expect(2);

  options = {
    format: 'M/D/YYYY'
  };

  message = validator.validate('1/1/15', assign({}, options));
  assert.equal(message, 'This field must be in the format of M/D/YYYY');

  message = validator.validate('1/1/2015', assign({}, options));
  assert.equal(message, true);
});

test('error date format', function(assert) {
  assert.expect(1);

  options = {
    errorFormat: 'M/D/YYYY',
    before: '1/1/2015'
  };

  message = validator.validate('1/1/2016', assign({}, options));
  assert.equal(message, 'This field must be before 1/1/2015');
});

test('before', function(assert) {
  assert.expect(2);

  options = {
    before: '1/1/2015'
  };

  message = validator.validate('1/1/2016', assign({}, options));
  assert.equal(message, 'This field must be before Jan 1st, 2015');

  message = validator.validate('1/1/2014', assign({}, options));
  assert.equal(message, true);
});

test('before now', function(assert) {
  assert.expect(2);
  var now = moment().format('MMM Do, YYYY');
  options = {
    before: 'now'
  };
  message = validator.validate('1/1/3015', assign({}, options));
  assert.equal(message, `This field must be before ${now}`);

  message = validator.validate('1/1/2014', assign({}, options));
  assert.equal(message, true);
});

test('before or on', function(assert) {
  assert.expect(3);

  options = {
    onOrBefore: '1/1/2015'
  };

  message = validator.validate('1/1/2016', assign({}, options));
  assert.equal(message, 'This field must be on or before Jan 1st, 2015');

  message = validator.validate('1/1/2014', assign({}, options));
  assert.equal(message, true);

  message = validator.validate('1/1/2015', assign({}, options));
  assert.equal(message, true);
});

test('before now or on', function(assert) {
  assert.expect(3);
  var now = moment().format('MMM Do, YYYY');
  options = {
    onOrBefore: 'now'
  };
  message = validator.validate('1/1/3015', assign({}, options));
  assert.equal(message, `This field must be on or before ${now}`);

  message = validator.validate('1/1/2014', assign({}, options));
  assert.equal(message, true);

  message = validator.validate('now', assign({}, options));
  assert.equal(message, true);
});

test('before or on percision', function(assert) {
  var percisions = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year'];

  assert.expect((percisions.length * 3) -1);
  var date = '2013-02-08T09:30:26';
  var now = moment(date);
  var dateString = now.toString();
  var nowMessage = now.format('MMM Do, YYYY');

  for (var i = 0; i < percisions.length; i++) {
    var percision = percisions[i];

    message = validator.validate(dateString, { onOrBefore: dateString });
    assert.equal(message, true);

    message = validator.validate(moment(dateString).add(1, percision), { onOrBefore: dateString });
    assert.equal(message, `This field must be on or before ${nowMessage}`);

    if ((i + 1) !== percisions.length) {
      message = validator.validate(moment(dateString).add(1, percisions), { onOrBefore: dateString, percision: percisions[i + 1] });
      assert.equal(message, true);
    }
  }
});

test('after', function(assert) {
  assert.expect(2);

  options = {
    after: '1/1/2015'
  };

  message = validator.validate('1/1/2014', assign({}, options));
  assert.equal(message, 'This field must be after Jan 1st, 2015');

  message = validator.validate('1/1/2016', assign({}, options));
  assert.equal(message, true);
});

test('after now', function(assert) {
  assert.expect(2);
  var now = moment().format('MMM Do, YYYY');
  options = {
    after: 'now'
  };

  message = validator.validate('1/1/2014', assign({}, options));
  assert.equal(message, `This field must be after ${now}`);

  message = validator.validate('1/1/3015', assign({}, options));
  assert.equal(message, true);
});

test('after or on', function(assert) {
  assert.expect(3);

  options = {
    onOrAfter: '1/1/2015'
  };

  message = validator.validate('1/1/2014', assign({}, options));
  assert.equal(message, 'This field must be on or after Jan 1st, 2015');

  message = validator.validate('1/1/2016', assign({}, options));
  assert.equal(message, true);

  message = validator.validate('1/1/2015', assign({}, options));
  assert.equal(message, true);
});

test('after now or on', function(assert) {
  assert.expect(3);
  var now = moment().format('MMM Do, YYYY');
  options = {
    onOrAfter: 'now'
  };

  message = validator.validate('1/1/2014', assign({}, options));
  assert.equal(message, `This field must be on or after ${now}`);

  message = validator.validate('1/1/3015', assign({}, options));
  assert.equal(message, true);

  message = validator.validate('now', assign({}, options));
  assert.equal(message, true);
});

test('after or on percision', function(assert) {
  var percisions = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year'];

  assert.expect((percisions.length * 3) -1);
  var date = '2013-02-08T09:30:26';
  var now = moment(date);
  var dateString = now.toString();
  var nowMessage = now.format('MMM Do, YYYY');

  for (var i = 0; i < percisions.length; i++) {
    var percision = percisions[i];

    message = validator.validate(dateString, { onOrAfter: dateString });
    assert.equal(message, true);

    message = validator.validate(moment(dateString).subtract(1, percision), { onOrAfter: dateString });
    assert.equal(message, `This field must be on or after ${nowMessage}`);

    if ((i + 1) !== percisions.length) {
      message = validator.validate(moment(dateString).subtract(1, percisions), { onOrAfter: dateString, percision: percisions[i + 1] });
      assert.equal(message, true);
    }
  }
});