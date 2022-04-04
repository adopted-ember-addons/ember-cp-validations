import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

let options, builtOptions, validator, message;

module('Unit | Validator | date', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    validator = this.owner.lookup('validator:date');
  });

  test('no options', function (assert) {
    assert.expect(1);

    options = {};
    message = validator.validate(undefined, options);
    assert.equal(message, true);
  });

  test('allow blank', function (assert) {
    assert.expect(2);

    options = {
      allowBlank: true,
      before: '1/1/2015',
    };

    builtOptions = validator.buildOptions(options);

    message = validator.validate('', builtOptions.toObject());
    assert.equal(message, true);

    message = validator.validate('1/1/2016', builtOptions.toObject());
    assert.equal(message, 'This field must be before January 1, 2015');
  });

  test('valid date', function (assert) {
    assert.expect(2);

    options = {};

    builtOptions = validator.buildOptions(options);

    message = validator.validate('abc', builtOptions.toObject());
    assert.equal(message, 'This field must be a valid date');

    message = validator.validate(new Date(), builtOptions.toObject());
    assert.equal(message, true);
  });

  test('valid input date format', function (assert) {
    assert.expect(2);

    options = {
      format: { dateStyle: 'long' },
    };

    builtOptions = validator.buildOptions(options);

    message = validator.validate('27/3/15', builtOptions.toObject());
    assert.equal(message, 'This field must be a valid date');

    message = validator.validate('27/3/2015', builtOptions.toObject());
    assert.equal(message, 'This field must be a valid date');
  });

  test('error date format', function (assert) {
    assert.expect(1);

    options = {
      errorFormat: { dateStyle: 'long' },
      before: '1/1/2015',
    };

    builtOptions = validator.buildOptions(options);

    message = validator.validate('1/1/2016', builtOptions.toObject());
    assert.equal(message, 'This field must be before January 1, 2015');
  });

  test('before', function (assert) {
    assert.expect(2);

    options = {
      before: '1/1/2015',
    };

    builtOptions = validator.buildOptions(options);

    message = validator.validate('1/1/2016', builtOptions.toObject());
    assert.equal(message, 'This field must be before January 1, 2015');

    message = validator.validate('1/1/2014', builtOptions.toObject());
    assert.equal(message, true);
  });

  test('before or on', function (assert) {
    assert.expect(3);

    options = {
      onOrBefore: '1/1/2015',
    };

    builtOptions = validator.buildOptions(options);

    message = validator.validate('1/1/2016', builtOptions.toObject());
    assert.equal(message, 'This field must be on or before January 1, 2015');

    message = validator.validate('1/1/2014', builtOptions.toObject());
    assert.equal(message, true);

    message = validator.validate('1/1/2015', builtOptions.toObject());
    assert.equal(message, true);
  });

  test('after', function (assert) {
    assert.expect(2);

    options = {
      after: '1/1/2015',
    };

    builtOptions = validator.buildOptions(options);

    message = validator.validate('1/1/2014', builtOptions.toObject());
    assert.equal(message, 'This field must be after January 1, 2015');

    message = validator.validate('1/1/2016', builtOptions.toObject());
    assert.equal(message, true);
  });

  test('after or on', function (assert) {
    assert.expect(3);

    options = {
      onOrAfter: '1/1/2015',
    };

    builtOptions = validator.buildOptions(options);

    message = validator.validate('1/1/2014', builtOptions.toObject());
    assert.equal(message, 'This field must be on or after January 1, 2015');

    message = validator.validate('1/1/2016', builtOptions.toObject());
    assert.equal(message, true);

    message = validator.validate('1/1/2015', builtOptions.toObject());
    assert.equal(message, true);
  });
});
