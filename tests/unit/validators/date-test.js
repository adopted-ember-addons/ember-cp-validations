import moment from 'moment';
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
    assert.true(message);
  });

  test('allow blank', function (assert) {
    assert.expect(2);

    options = {
      allowBlank: true,
      before: new Date('1/1/2015'),
    };

    builtOptions = validator.buildOptions(options);

    message = validator.validate('', builtOptions.toObject());
    assert.true(message);

    message = validator.validate('1/1/2016', builtOptions.toObject());
    assert.strictEqual(message, 'This field must be before January 1, 2015');
  });

  test('valid date', function (assert) {
    assert.expect(2);

    options = {};

    builtOptions = validator.buildOptions(options);

    message = validator.validate('abc', builtOptions.toObject());
    assert.strictEqual(message, 'This field must be a valid date');

    message = validator.validate(new Date(), builtOptions.toObject());
    assert.true(message);
  });

  test('valid input date format', function (assert) {
    assert.expect(2);

    options = {
      format: { year: 'numeric', month: 'numeric', day: '2-digit' },
    };

    builtOptions = validator.buildOptions(options);

    message = validator.validate('27/3/15', builtOptions.toObject());
    assert.strictEqual(message, 'This field must be a valid date');

    message = validator.validate(
      new Date('3/27/2015'),
      builtOptions.toObject(),
    );
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
    assert.strictEqual(message, 'This field must be before 1/1/2015');
  });

  test('before', function (assert) {
    assert.expect(2);

    options = {
      before: '1/1/2015',
    };

    builtOptions = validator.buildOptions(options);

    message = validator.validate('1/1/2016', builtOptions.toObject());
    assert.strictEqual(message, 'This field must be before January 1, 2015');

    message = validator.validate('1/1/2014', builtOptions.toObject());
    assert.true(message);
  });

  test('before now', function (assert) {
    assert.expect(2);
    let now = new Intl.DateTimeFormat('en', { dateStyle: 'long' }).format(
      new Date('1/1/3015'),
    );
    options = {
      before: new Intl.DateTimeFormat('en', { dateStyle: 'long' }).format(
        new Date('1/1/3015'),
      ),
    };

    builtOptions = validator.buildOptions(options);

    message = validator.validate('1/1/3015', builtOptions.toObject());
    assert.strictEqual(message, `This field must be before ${now}`);

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
    assert.strictEqual(
      message,
      'This field must be on or before January 1, 2015',
    );

    message = validator.validate('1/1/2014', builtOptions.toObject());
    assert.true(message);

    message = validator.validate('1/1/2015', builtOptions.toObject());
    assert.true(message);
  });

  test('before now or on', function (assert) {
    assert.expect(3);
    let now = new Date();
    options = {
      onOrBefore: new Date(),
    };

    builtOptions = validator.buildOptions(options);

    message = validator.validate(new Date('1/1/3015'), builtOptions.toObject());
    assert.strictEqual(
      message,
      `This field must be on or before ${new Intl.DateTimeFormat('en', {
        dateStyle: 'long',
      }).format(now)}`,
    );

    message = validator.validate(new Date('1/1/2014'), builtOptions.toObject());
    assert.true(message);

    message = validator.validate(now, builtOptions.toObject());
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
    let now = new Date('2013-02-08T09:30:26');
    let dateString = now.toString();
    let nowMessage = new Intl.DateTimeFormat('en', {
      dateStyle: 'long',
    }).format(now);

    for (let i = 0; i < precisions.length; i++) {
      let precision = precisions[i];

      builtOptions = validator.buildOptions({ onOrBefore: dateString });

      message = validator.validate(now, builtOptions.toObject());
      assert.true(message);

      message = validator.validate(
        moment(now).add(1, precision),
        builtOptions.toObject(),
      );
      assert.strictEqual(
        message,
        `This field must be on or before ${nowMessage}`,
      );

      if (i + 1 !== precisions.length) {
        builtOptions = validator.buildOptions({
          onOrBefore: dateString,
          precision: precisions[i + 1],
        });

        message = validator.validate(
          moment(now).add(1, precisions),
          builtOptions.toObject(),
        );
        assert.true(message);
      }
    }
  });

  test('after', function (assert) {
    assert.expect(2);

    options = {
      after: new Date('1/1/2015'),
    };

    builtOptions = validator.buildOptions(options);

    message = validator.validate('1/1/2014', builtOptions.toObject());
    assert.strictEqual(message, 'This field must be after January 1, 2015');

    message = validator.validate('1/1/2016', builtOptions.toObject());
    assert.true(message);
  });

  test('after now', function (assert) {
    assert.expect(2);
    let now = new Intl.DateTimeFormat('en', { dateStyle: 'long' }).format();
    options = {
      after: new Date(),
    };

    builtOptions = validator.buildOptions(options);

    message = validator.validate('1/1/2014', builtOptions.toObject());
    assert.strictEqual(message, `This field must be after ${now}`);

    message = validator.validate('1/1/3015', builtOptions.toObject());
    assert.true(message);
  });

  test('after or on', function (assert) {
    assert.expect(3);

    options = {
      onOrAfter: new Date('1/1/2015'),
    };

    builtOptions = validator.buildOptions(options);

    message = validator.validate('1/1/2014', builtOptions.toObject());
    assert.strictEqual(
      message,
      'This field must be on or after January 1, 2015',
    );

    message = validator.validate('1/1/2016', builtOptions.toObject());
    assert.true(message);

    message = validator.validate('1/1/2015', builtOptions.toObject());
    assert.true(message);
  });

  test('after now or on', function (assert) {
    assert.expect(3);
    let now = new Intl.DateTimeFormat('en', { dateStyle: 'long' }).format();
    options = {
      onOrAfter: new Intl.DateTimeFormat('en', { dateStyle: 'long' }).format(),
      precision: 'second',
    };

    builtOptions = validator.buildOptions(options);

    message = validator.validate('1/1/2014', builtOptions.toObject());
    assert.strictEqual(message, `This field must be on or after ${now}`);

    message = validator.validate('1/1/3015', builtOptions.toObject());
    assert.true(message);

    message = validator.validate(now, builtOptions.toObject());
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
    let now = new Date('2013-02-08T09:30:26');
    let dateString = now.toString();
    let nowMessage = new Intl.DateTimeFormat('en', {
      dateStyle: 'long',
    }).format(now);

    for (let i = 0; i < precisions.length; i++) {
      let precision = precisions[i];

      builtOptions = validator.buildOptions({ onOrAfter: dateString });

      message = validator.validate(now, builtOptions.toObject());
      assert.true(message);

      message = validator.validate(
        moment(now).subtract(1, precision),
        builtOptions.toObject(),
      );
      assert.strictEqual(
        message,
        `This field must be on or after ${nowMessage}`,
      );

      if (i + 1 !== precisions.length) {
        builtOptions = validator.buildOptions({
          onOrAfter: dateString,
          precision: precisions[i + 1],
        });

        message = validator.validate(
          moment(now).subtract(1, precisions),
          builtOptions.toObject(),
        );
        assert.true(message);
      }
    }
  });
});
