import moment from 'moment';
import { only, module, test } from 'qunit';
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
    assert.true(message);
  });

  test('allow blank', function (assert) {
    assert.expect(2);

    options = {
      allowBlank: true,
      before: '1/1/2015',
    };

    builtOptions = validator.buildOptions(options);

    message = validator.validate('', builtOptions.toObject());
    assert.true(message);

    message = validator.validate('1/1/2016', builtOptions.toObject());
    assert.deepEqual(message, 'This field must be before January 1, 2015');
  });

  test('valid date', function (assert) {
    assert.expect(2);

    options = {};

    builtOptions = validator.buildOptions(options);

    message = validator.validate('abc', builtOptions.toObject());
    assert.deepEqual(message, 'This field must be a valid date');

    message = validator.validate(new Date(), builtOptions.toObject());
    assert.true(message);
  });

  test('valid input date format', function (assert) {
    assert.expect(2);

    options = {
      format: { dateStyle: 'short' },
    };

    builtOptions = validator.buildOptions(options);

    message = validator.validate('27/3/2015', builtOptions.toObject());
    assert.deepEqual(message, 'This field must be a valid date');

    message = validator.validate('03/27/15', builtOptions.toObject());
    assert.true(message);
  });

  test('error date format', function (assert) {
    assert.expect(1);

    options = {
      errorFormat: 'M/D/YYYY',
      before: '1/1/2015',
    };

    builtOptions = validator.buildOptions(options);

    message = validator.validate('1/1/2016', builtOptions.toObject());
    assert.deepEqual(message, 'This field must be before 1/1/2015');
  });

  test('before', function (assert) {
    assert.expect(2);

    options = {
      before: '1/1/2015',
    };

    builtOptions = validator.buildOptions(options);

    message = validator.validate('1/1/2016', builtOptions.toObject());
    assert.deepEqual(message, 'This field must be before January 1, 2015');

    message = validator.validate('1/1/2014', builtOptions.toObject());
    assert.true(message);
  });

  test('before or on', function (assert) {
    assert.expect(3);

    options = {
      onOrBefore: '1/1/2015',
    };

    builtOptions = validator.buildOptions(options);

    message = validator.validate('1/1/2016', builtOptions.toObject());
    assert.deepEqual(
      message,
      'This field must be on or before January 1, 2015'
    );

    message = validator.validate('1/1/2014', builtOptions.toObject());
    assert.true(message);

    message = validator.validate('1/1/2015', builtOptions.toObject());
    assert.true(message);
  });

  test('before or on precision', function (assert) {
    let precisions = [
      'second',
      'minute',
      'hour',
      'day',
      'week',
      'month',
      'year',
    ];

    assert.expect(precisions.length * 3 - 1);
    let now = moment(new Date('2013-02-08T09:30:26'));
    let dateString = now.toString();
    let nowMessage = now.format('MMMM D, YYYY');

    for (let i = 0; i < precisions.length; i++) {
      let precision = precisions[i];

      builtOptions = validator.buildOptions({ onOrBefore: dateString });

      message = validator.validate(now, builtOptions.toObject());
      assert.true(message);

      message = validator.validate(
        moment(now).add(1, precision).toDate(),
        builtOptions.toObject()
      );
      assert.deepEqual(
        message,
        `This field must be on or before ${nowMessage}`
      );

      if (i + 1 !== precisions.length) {
        builtOptions = validator.buildOptions({
          onOrBefore: dateString,
          precision: precisions[i + 1],
        });

        message = validator.validate(
          moment(now).add(1, precisions).toDate(),
          builtOptions.toObject()
        );
        assert.true(message);
      }
    }
  });

  test('after', function (assert) {
    assert.expect(2);

    options = {
      after: '1/1/2015',
    };

    builtOptions = validator.buildOptions(options);

    message = validator.validate('1/1/2014', builtOptions.toObject());
    assert.deepEqual(message, 'This field must be after January 1, 2015');

    message = validator.validate('1/1/2016', builtOptions.toObject());
    assert.true(message);
  });

  test('after or on', function (assert) {
    assert.expect(3);

    options = {
      onOrAfter: '1/1/2015',
    };

    builtOptions = validator.buildOptions(options);

    message = validator.validate('1/1/2014', builtOptions.toObject());
    assert.deepEqual(message, 'This field must be on or after January 1, 2015');

    message = validator.validate('1/1/2016', builtOptions.toObject());
    assert.true(message);

    message = validator.validate('1/1/2015', builtOptions.toObject());
    assert.true(message);
  });

  test('after or on precision', function (assert) {
    let precisions = [
      'second',
      'minute',
      'hour',
      'day',
      'week',
      'month',
      'year',
    ];

    assert.expect(precisions.length * 3 - 1);
    let now = moment(new Date('2013-02-08T09:30:26'));
    let dateString = now.toString();
    let nowMessage = now.format('MMMM D, YYYY');

    for (let i = 0; i < precisions.length; i++) {
      let precision = precisions[i];

      builtOptions = validator.buildOptions({ onOrAfter: dateString });

      message = validator.validate(now, builtOptions.toObject());
      assert.true(message);

      message = validator.validate(
        moment(now).subtract(1, precision).toDate(),
        builtOptions.toObject()
      );
      assert.deepEqual(message, `This field must be on or after ${nowMessage}`);

      if (i + 1 !== precisions.length) {
        builtOptions = validator.buildOptions({
          onOrAfter: dateString,
          precision: precisions[i + 1],
        });

        message = validator.validate(
          moment(now).subtract(1, precisions).toDate(),
          builtOptions.toObject()
        );
        assert.true(message);
      }
    }
  });
});
