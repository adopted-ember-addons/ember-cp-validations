import moment from 'moment';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

const defaultErrorFormat = 'MMM Do, YYYY';
const nowMessage = moment().format(defaultErrorFormat);

module('Unit | Validator | date-moment', function (hooks) {
  let options, builtOptions, validator, message;
  setupTest(hooks);

  hooks.beforeEach(function () {
    validator = this.owner.lookup('validator:date-moment');
  });

  test('no options', function (assert) {
    assert.expect(1);

    options = {};
    message = validator.validate(undefined, options);
    assert.true(message);
  });

  test('allow blank', function (assert) {
    assert.expect(4);

    options = {
      allowBlank: true,
      before: '1/1/2015',
    };

    builtOptions = validator.buildOptions(options);

    ['', null, undefined].forEach((blank) =>
      assert.true(
        validator.validate(blank, builtOptions.toObject()),
        `allowBlank should pass when value="${blank}"`
      )
    );

    message = validator.validate('1/1/2016', builtOptions.toObject());
    assert.strictEqual(
      message,
      'This field must be before Jan 1st, 2015',
      'should validate accordingly when "before" is not empty'
    );
  });

  test('valid date', function (assert) {
    assert.expect(3);

    const opts = validator.buildOptions({}).toObject();

    assert.strictEqual(
      validator.validate('abc', opts),
      'This field must be a valid date',
      'returns "date" error when given non-date'
    );

    assert.true(
      validator.validate(new Date(), opts),
      'should pass validation when given a JS Date'
    );

    assert.true(
      validator.validate(moment(), opts),
      'should validate when given a Moment'
    );
  });

  test('options.format - string input must match schema', function (assert) {
    assert.expect(4);

    options = {
      format: 'DD/M/YYYY',
    };

    builtOptions = validator.buildOptions(options);

    message = validator.validate('27/3/15', builtOptions.toObject());
    assert.strictEqual(
      message,
      'This field must be in the format of DD/M/YYYY'
    );

    message = validator.validate('27/3/2015', builtOptions.toObject());
    assert.true(message, 'should validate when input has correct format');

    [moment(), new Date()].forEach((notString) => {
      assert.true(
        validator.validate(notString, builtOptions.toObject()),
        'existing date objects should validate successfully'
      );
    });
  });

  test('options.errorFormat - used in validation messages', function (assert) {
    assert.expect(1);

    options = {
      errorFormat: 'M/D/YYYY',
      before: '1/1/2015',
    };

    builtOptions = validator.buildOptions(options);

    message = validator.validate('1/1/2016', builtOptions.toObject());
    assert.strictEqual(
      message,
      'This field must be before 1/1/2015',
      'should report in custom date format'
    );
  });

  ['before', 'onOrBefore', 'after', 'onOrAfter'].forEach((relation) => {
    module(`options.${relation}`, function () {
      test('when not a date - validation error raised', function (assert) {
        const values = ['', null, 'not a date'];

        values.forEach((value) => {
          const opts = validator.buildOptions({ [relation]: value }).toObject();
          const message = validator.validate(moment(), opts);
          assert.true(
            typeof message === 'string',
            `validation should fail when ${relation} is ${
              value ? `${value}` : `"${value}"`
            }`
          );
        });
      });

      test('when validation error raised - does not modify relation value', function (assert) {
        const value = moment();
        const reference = relation.toLowerCase().includes('after')
          ? value.clone().add(10)
          : value.clone().subtract(10);
        const source = { [relation]: reference };
        const sourceSpy = new Proxy(source, {
          set() {
            assert.false('attempted to mutate source to buildOptions');
          },
        });
        const options = validator.buildOptions(sourceSpy).toObject();
        const optionsSpy = new Proxy(options, {
          set() {
            assert.false('attempted to mutate options object');
          },
        });

        message = validator.validate(value, optionsSpy);
        assert.true(typeof message === 'string', 'precondition not met');
      });
    });
  });

  test('before', function (assert) {
    assert.expect(2);

    options = {
      before: '1/1/2015',
    };

    builtOptions = validator.buildOptions(options);

    message = validator.validate('1/1/2016', builtOptions.toObject());
    assert.strictEqual(message, 'This field must be before Jan 1st, 2015');

    message = validator.validate('1/1/2014', builtOptions.toObject());
    assert.true(message);
  });

  test('before "now"', function (assert) {
    assert.expect(2);

    options = {
      before: 'now',
    };

    const opts = validator.buildOptions(options).toObject();

    message = validator.validate('1/1/3015', opts);
    assert.strictEqual(
      message,
      `This field must be before ${nowMessage}`,
      '"before now" should not validate dates in future'
    );

    message = validator.validate(moment().subtract(1, 'millisecond'), opts);
    assert.true(message, '"before now" should validate dates in the past');
  });

  test('before or on', function (assert) {
    assert.expect(3);

    options = {
      onOrBefore: '1/1/2015',
    };

    builtOptions = validator.buildOptions(options);

    message = validator.validate('1/1/2016', builtOptions.toObject());
    assert.strictEqual(
      message,
      'This field must be on or before Jan 1st, 2015'
    );

    message = validator.validate('1/1/2014', builtOptions.toObject());
    assert.true(message, 'should accept dates in past');

    message = validator.validate('1/1/2015', builtOptions.toObject());
    assert.true(message, 'should accept same date as reference');
  });

  test('before "now" or on', function (assert) {
    assert.expect(3);

    options = {
      onOrBefore: 'now',
    };

    builtOptions = validator.buildOptions(options);

    message = validator.validate('1/1/3015', builtOptions.toObject());
    assert.strictEqual(
      message,
      `This field must be on or before ${nowMessage}`
    );

    message = validator.validate('1/1/2014', builtOptions.toObject());
    assert.true(message, 'should accept dates in past');

    message = validator.validate(moment(), builtOptions.toObject());
    assert.true(message, 'should accept dates equivalent to "now"');
  });

  test('before or on - precision', function (assert) {
    const precisions = [
      'second',
      'minute',
      'hour',
      'day',
      'week',
      'month',
      'year',
    ];

    assert.expect(precisions.length * 3 - 1);
    const date = moment('2013-02-08T09:30:26');
    const onOrBefore = date.toString();
    const dateMessage = date.format(defaultErrorFormat);

    for (let i = 0; i < precisions.length; i++) {
      const precision = precisions[i];
      const opts = validator.buildOptions({ onOrBefore, precision }).toObject();

      message = validator.validate(date, opts);
      assert.true(
        message,
        `precondition: passing the onOrBefore value as input should pass when precision is "${precision}"`
      );

      const largerByPrecision = moment(date).add(1, precision);
      message = validator.validate(largerByPrecision, opts);
      assert.strictEqual(
        message,
        `This field must be on or before ${dateMessage}`,
        `should reject dates that differ by ${precision}s when precision is "${precision}"`
      );

      if (i + 1 < precisions.length) {
        builtOptions = validator.buildOptions({
          onOrBefore,
          precision: precisions[i + 1],
        });

        message = validator.validate(
          moment(date).add(1, precision),
          builtOptions.toObject()
        );
        assert.true(
          message,
          `should accept dates differing by ${precision}s when precision is ${builtOptions.precision}`
        );
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
    assert.strictEqual(message, 'This field must be after Jan 1st, 2015');

    message = validator.validate('1/1/2016', builtOptions.toObject());
    assert.true(message);
  });

  test('after now', function (assert) {
    assert.expect(2);

    options = {
      after: 'now',
    };

    builtOptions = validator.buildOptions(options);

    message = validator.validate('1/1/2014', builtOptions.toObject());
    assert.strictEqual(
      message,
      `This field must be after ${nowMessage}`,
      '"after now" should not validate dates in the past'
    );

    message = validator.validate('1/1/3015', builtOptions.toObject());
    assert.true(message, '"after now should validate dates in the future');
  });

  test('after or on', function (assert) {
    assert.expect(3);

    options = {
      onOrAfter: '1/1/2015',
    };

    builtOptions = validator.buildOptions(options);

    message = validator.validate('1/1/2014', builtOptions.toObject());
    assert.strictEqual(message, 'This field must be on or after Jan 1st, 2015');

    message = validator.validate('1/1/2016', builtOptions.toObject());
    assert.true(message, 'should accept dates in future');

    message = validator.validate('1/1/2015', builtOptions.toObject());
    assert.true(message, 'should accept same date as reference');
  });

  test('after now or on', function (assert) {
    assert.expect(3);
    options = {
      onOrAfter: 'now',
    };

    builtOptions = validator.buildOptions(options);

    message = validator.validate('1/1/2014', builtOptions.toObject());
    assert.strictEqual(message, `This field must be on or after ${nowMessage}`);

    message = validator.validate('1/1/3015', builtOptions.toObject());
    assert.true(message, 'should accept dates in future');

    message = validator.validate(moment(), builtOptions.toObject());
    assert.true(message, 'should accept dates equivalent to "now"');
  });

  test('after or on precision', function (assert) {
    const precisions = [
      'second',
      'minute',
      'hour',
      'day',
      'week',
      'month',
      'year',
    ];

    assert.expect(precisions.length * 3 - 1);
    const date = moment('2013-02-08T09:30:26');
    const onOrAfter = date.toString();
    const dateMessage = date.format(defaultErrorFormat);

    for (let i = 0; i < precisions.length; i++) {
      const precision = precisions[i];
      const opts = validator.buildOptions({ onOrAfter, precision }).toObject();

      message = validator.validate(date, opts);
      assert.true(
        message,
        `precondition: passing the onOrAfter value as input should pass when precision is "${precision}"`
      );

      const smallerByPrecision = moment(date).subtract(1, precision);
      message = validator.validate(smallerByPrecision, opts);
      assert.strictEqual(
        message,
        `This field must be on or after ${dateMessage}`,
        `should reject dates that differ by ${precision}s when precision is "${precision}"`
      );

      if (i + 1 !== precisions.length) {
        builtOptions = validator.buildOptions({
          onOrAfter,
          precision: precisions[i + 1],
        });

        message = validator.validate(
          moment(date).subtract(1, precisions),
          builtOptions.toObject()
        );
        assert.true(
          message,
          `should accept dates differing by ${precision}s when precision is ${builtOptions.precision}`
        );
      }
    }
  });
});
