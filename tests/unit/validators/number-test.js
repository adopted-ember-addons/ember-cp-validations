import { moduleFor, test } from 'ember-qunit';

let options, builtOptions, validator, message;

moduleFor('validator:number', 'Unit | Validator | number', {
  needs: ['validator:messages'],
  setup() {
    validator = this.subject();
  }
});

test('no options', function(assert) {
  assert.expect(2);

  builtOptions = validator.buildOptions({});

  message = validator.validate(undefined, builtOptions.toObject());
  assert.equal(message, 'This field must be a number');

  message = validator.validate(22, builtOptions.toObject());
  assert.equal(message, true);
});

test('allow string', function(assert) {
  assert.expect(6);

  options = {
    allowString: true
  };
  builtOptions = validator.buildOptions(options);

  message = validator.validate('22', builtOptions.toObject());
  assert.equal(message, true);

  message = validator.validate('22.22', builtOptions.toObject());
  assert.equal(message, true);

  message = validator.validate('test', builtOptions.toObject());
  assert.equal(message, 'This field must be a number');

  message = validator.validate('', builtOptions.toObject());
  assert.equal(message, 'This field must be a number');

  options.allowString = false;
  builtOptions = validator.buildOptions(options);

  message = validator.validate('22', builtOptions.toObject());
  assert.equal(message, 'This field must be a number');

  message = validator.validate('22.22', builtOptions.toObject());
  assert.equal(message, 'This field must be a number');
});

test('integer', function(assert) {
  assert.expect(3);

  options = {
    integer: true
  };
  builtOptions = validator.buildOptions(options);

  message = validator.validate(22, builtOptions.toObject());
  assert.equal(message, true);

  message = validator.validate(22.22, builtOptions.toObject());
  assert.equal(message, 'This field must be an integer');

  message = validator.validate(-2.2, builtOptions.toObject());
  assert.equal(message, 'This field must be an integer');
});

test('is', function(assert) {
  assert.expect(2);

  options = {
    is: 22
  };
  builtOptions = validator.buildOptions(options);

  message = validator.validate(1, builtOptions.toObject());
  assert.equal(message, 'This field must be equal to 22');

  message = validator.validate(22, builtOptions.toObject());
  assert.equal(message, true);
});

test('lt', function(assert) {
  assert.expect(3);

  options = {
    lt: 22
  };
  builtOptions = validator.buildOptions(options);

  message = validator.validate(21, builtOptions.toObject());
  assert.equal(message, true);

  message = validator.validate(22, builtOptions.toObject());
  assert.equal(message, 'This field must be less than 22');

  message = validator.validate(23, builtOptions.toObject());
  assert.equal(message, 'This field must be less than 22');
});

test('lte', function(assert) {
  assert.expect(3);

  options = {
    lte: 22
  };
  builtOptions = validator.buildOptions(options);

  message = validator.validate(21, builtOptions.toObject());
  assert.equal(message, true);

  message = validator.validate(22, builtOptions.toObject());
  assert.equal(message, true);

  message = validator.validate(23, builtOptions.toObject());
  assert.equal(message, 'This field must be less than or equal to 22');
});

test('gt', function(assert) {
  assert.expect(3);

  options = {
    gt: 22
  };
  builtOptions = validator.buildOptions(options);

  message = validator.validate(21, builtOptions.toObject());
  assert.equal(message, 'This field must be greater than 22');

  message = validator.validate(22, builtOptions.toObject());
  assert.equal(message, 'This field must be greater than 22');

  message = validator.validate(23, builtOptions.toObject());
  assert.equal(message, true);
});

test('gte', function(assert) {
  assert.expect(3);

  options = {
    gte: 22
  };
  builtOptions = validator.buildOptions(options);

  message = validator.validate(21, builtOptions.toObject());
  assert.equal(message, 'This field must be greater than or equal to 22');

  message = validator.validate(22, builtOptions.toObject());
  assert.equal(message, true);

  message = validator.validate(23, builtOptions.toObject());
  assert.equal(message, true);
});

test('positive', function(assert) {
  assert.expect(4);

  options = {
    positive: true
  };
  builtOptions = validator.buildOptions(options);

  message = validator.validate(-1, builtOptions.toObject());
  assert.equal(message, 'This field must be positive');

  message = validator.validate(-144, builtOptions.toObject());
  assert.equal(message, 'This field must be positive');

  message = validator.validate(0, builtOptions.toObject());
  assert.equal(message, true);

  message = validator.validate(22, builtOptions.toObject());
  assert.equal(message, true);
});

test('odd', function(assert) {
  assert.expect(4);

  options = {
    odd: true
  };
  builtOptions = validator.buildOptions(options);

  message = validator.validate(22, builtOptions.toObject());
  assert.equal(message, 'This field must be odd');

  message = validator.validate(-144, builtOptions.toObject());
  assert.equal(message, 'This field must be odd');

  message = validator.validate(21, builtOptions.toObject());
  assert.equal(message, true);

  message = validator.validate(-21, builtOptions.toObject());
  assert.equal(message, true);
});

test('even', function(assert) {
  assert.expect(5);

  options = {
    even: true
  };
  builtOptions = validator.buildOptions(options);

  message = validator.validate(22, builtOptions.toObject());
  assert.equal(message, true);

  message = validator.validate(-22, builtOptions.toObject());
  assert.equal(message, true);

  message = validator.validate(22.22, builtOptions.toObject());
  assert.equal(message, 'This field must be even');

  message = validator.validate(21, builtOptions.toObject());
  assert.equal(message, 'This field must be even');

  message = validator.validate(-33, builtOptions.toObject());
  assert.equal(message, 'This field must be even');
});

test('allowBlank', function(assert) {
  assert.expect(3);

  options = {
    allowBlank: true
  };
  builtOptions = validator.buildOptions(options);

  message = validator.validate(null, builtOptions.toObject());
  assert.equal(message, true);

  message = validator.validate(undefined, builtOptions.toObject());
  assert.equal(message, true);

  message = validator.validate('', builtOptions.toObject());
  assert.equal(message, true);
});
