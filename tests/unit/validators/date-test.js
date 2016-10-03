/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import moment from 'moment';
import { moduleFor, test } from 'ember-qunit';

let options, builtOptions, validator, message;

moduleFor('validator:date', 'Unit | Validator | date', {
  needs: ['validator:messages'],
  setup() {
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

  builtOptions = validator.buildOptions(options);

  message = validator.validate('', builtOptions.copy());
  assert.equal(message, true);

  message = validator.validate('1/1/2016', builtOptions.copy());
  assert.equal(message, 'This field must be before Jan 1st, 2015');
});

test('valid date', function(assert) {
  assert.expect(2);

  options = {};

  builtOptions = validator.buildOptions(options);

  message = validator.validate('abc', builtOptions.copy());
  assert.equal(message, 'This field must be a valid date');

  message = validator.validate(new Date(), builtOptions.copy());
  assert.equal(message, true);
});

test('valid input date format', function(assert) {
  assert.expect(2);

  options = {
    format: 'DD/M/YYYY'
  };

  builtOptions = validator.buildOptions(options);

  message = validator.validate('27/3/15', builtOptions.copy());
  assert.equal(message, 'This field must be in the format of DD/M/YYYY');

  message = validator.validate('27/3/2015', builtOptions.copy());
  assert.equal(message, true);
});

test('error date format', function(assert) {
  assert.expect(1);

  options = {
    errorFormat: 'M/D/YYYY',
    before: '1/1/2015'
  };

  builtOptions = validator.buildOptions(options);

  message = validator.validate('1/1/2016', builtOptions.copy());
  assert.equal(message, 'This field must be before 1/1/2015');
});

test('before', function(assert) {
  assert.expect(2);

  options = {
    before: '1/1/2015'
  };

  builtOptions = validator.buildOptions(options);

  message = validator.validate('1/1/2016', builtOptions.copy());
  assert.equal(message, 'This field must be before Jan 1st, 2015');

  message = validator.validate('1/1/2014', builtOptions.copy());
  assert.equal(message, true);
});

test('before now', function(assert) {
  assert.expect(2);
  let now = moment().format('MMM Do, YYYY');
  options = {
    before: 'now'
  };

  builtOptions = validator.buildOptions(options);

  message = validator.validate('1/1/3015', builtOptions.copy());
  assert.equal(message, `This field must be before ${now}`);

  message = validator.validate('1/1/2014', builtOptions.copy());
  assert.equal(message, true);
});

test('before or on', function(assert) {
  assert.expect(3);

  options = {
    onOrBefore: '1/1/2015'
  };

  builtOptions = validator.buildOptions(options);

  message = validator.validate('1/1/2016', builtOptions.copy());
  assert.equal(message, 'This field must be on or before Jan 1st, 2015');

  message = validator.validate('1/1/2014', builtOptions.copy());
  assert.equal(message, true);

  message = validator.validate('1/1/2015', builtOptions.copy());
  assert.equal(message, true);
});

test('before now or on', function(assert) {
  assert.expect(3);
  let now = moment().format('MMM Do, YYYY');
  options = {
    onOrBefore: 'now'
  };

  builtOptions = validator.buildOptions(options);

  message = validator.validate('1/1/3015', builtOptions.copy());
  assert.equal(message, `This field must be on or before ${now}`);

  message = validator.validate('1/1/2014', builtOptions.copy());
  assert.equal(message, true);

  message = validator.validate('now', builtOptions.copy());
  assert.equal(message, true);
});

test('before or on precision', function(assert) {
  let precisions = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year'];

  assert.expect((precisions.length * 3) - 1);
  let now = moment(new Date('2013-02-08T09:30:26'));
  let dateString = now.toString();
  let nowMessage = now.format('MMM Do, YYYY');

  for (let i = 0; i < precisions.length; i++) {
    let precision = precisions[i];

    builtOptions = validator.buildOptions({ onOrBefore: dateString });

    message = validator.validate(now, builtOptions.copy());
    assert.equal(message, true);

    message = validator.validate(moment(now).add(1, precision), builtOptions.copy());
    assert.equal(message, `This field must be on or before ${nowMessage}`);

    if ((i + 1) !== precisions.length) {
      builtOptions = validator.buildOptions({ onOrBefore: dateString, precision: precisions[i + 1] });

      message = validator.validate(moment(now).add(1, precisions), builtOptions.copy());
      assert.equal(message, true);
    }
  }
});

test('after', function(assert) {
  assert.expect(2);

  options = {
    after: '1/1/2015'
  };

  builtOptions = validator.buildOptions(options);

  message = validator.validate('1/1/2014', builtOptions.copy());
  assert.equal(message, 'This field must be after Jan 1st, 2015');

  message = validator.validate('1/1/2016', builtOptions.copy());
  assert.equal(message, true);
});

test('after now', function(assert) {
  assert.expect(2);
  let now = moment().format('MMM Do, YYYY');
  options = {
    after: 'now'
  };

  builtOptions = validator.buildOptions(options);

  message = validator.validate('1/1/2014', builtOptions.copy());
  assert.equal(message, `This field must be after ${now}`);

  message = validator.validate('1/1/3015', builtOptions.copy());
  assert.equal(message, true);
});

test('after or on', function(assert) {
  assert.expect(3);

  options = {
    onOrAfter: '1/1/2015'
  };

  builtOptions = validator.buildOptions(options);

  message = validator.validate('1/1/2014', builtOptions.copy());
  assert.equal(message, 'This field must be on or after Jan 1st, 2015');

  message = validator.validate('1/1/2016', builtOptions.copy());
  assert.equal(message, true);

  message = validator.validate('1/1/2015', builtOptions.copy());
  assert.equal(message, true);
});

test('after now or on', function(assert) {
  assert.expect(3);
  let now = moment().format('MMM Do, YYYY');
  options = {
    onOrAfter: 'now',
    precision: 'second'
  };

  builtOptions = validator.buildOptions(options);

  message = validator.validate('1/1/2014', builtOptions.copy());
  assert.equal(message, `This field must be on or after ${now}`);

  message = validator.validate('1/1/3015', builtOptions.copy());
  assert.equal(message, true);

  message = validator.validate('now', builtOptions.copy());
  assert.equal(message, true);
});

test('after or on precision', function(assert) {
  let precisions = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year'];

  assert.expect((precisions.length * 3) - 1);
  let now = moment(new Date('2013-02-08T09:30:26'));
  let dateString = now.toString();
  let nowMessage = now.format('MMM Do, YYYY');

  for (let i = 0; i < precisions.length; i++) {
    let precision = precisions[i];

    builtOptions = validator.buildOptions({ onOrAfter: dateString });

    message = validator.validate(now, builtOptions.copy());
    assert.equal(message, true);

    message = validator.validate(moment(now).subtract(1, precision), builtOptions.copy());
    assert.equal(message, `This field must be on or after ${nowMessage}`);

    if ((i + 1) !== precisions.length) {
      builtOptions = validator.buildOptions({ onOrAfter: dateString, precision: precisions[i + 1] });

      message = validator.validate(moment(now).subtract(1, precisions), builtOptions.copy());
      assert.equal(message, true);
    }
  }
});
