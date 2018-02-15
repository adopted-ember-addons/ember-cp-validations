import { moduleFor, test } from 'ember-qunit';

let options, builtOptions, validator, message;

moduleFor('validator:length', 'Unit | Validator | length', {
  needs: ['validator:messages'],
  setup() {
    validator = this.subject();
  }
});

test('no options', function(assert) {
  assert.expect(1);

  builtOptions = validator.buildOptions({});

  message = validator.validate(undefined, builtOptions.toObject());
  assert.equal(message, true);
});

test('allow blank', function(assert) {
  assert.expect(2);

  options = {
    allowBlank: true,
    min: 5
  };

  builtOptions = validator.buildOptions(options);

  message = validator.validate('', builtOptions.toObject());
  assert.equal(message, true);

  message = validator.validate('test', builtOptions.toObject());
  assert.equal(message, 'This field is too short (minimum is 5 characters)');
});

test('allow none', function(assert) {
  assert.expect(2);

  options = {
    // default allowNone should be true
  };

  builtOptions = validator.buildOptions(options);

  message = validator.validate(undefined, builtOptions.toObject());
  assert.equal(message, true);

  options.allowNone = false;
  builtOptions = validator.buildOptions(options);

  message = validator.validate(null, builtOptions.toObject());
  assert.equal(message, 'This field is invalid');
});

test('is', function(assert) {
  assert.expect(2);

  options = {
    is: 4
  };

  builtOptions = validator.buildOptions(options);

  message = validator.validate('testing', builtOptions.toObject());
  assert.equal(
    message,
    'This field is the wrong length (should be 4 characters)'
  );

  message = validator.validate('test', builtOptions.toObject());
  assert.equal(message, true);
});

test('min', function(assert) {
  assert.expect(2);

  options = {
    min: 5
  };

  builtOptions = validator.buildOptions(options);

  message = validator.validate('test', builtOptions.toObject());
  assert.equal(message, 'This field is too short (minimum is 5 characters)');

  message = validator.validate('testing', builtOptions.toObject());
  assert.equal(message, true);
});

test('max', function(assert) {
  assert.expect(2);

  options = {
    max: 5
  };

  builtOptions = validator.buildOptions(options);

  message = validator.validate('testing', builtOptions.toObject());
  assert.equal(message, 'This field is too long (maximum is 5 characters)');

  message = validator.validate('test', builtOptions.toObject());
  assert.equal(message, true);
});

test('array', function(assert) {
  assert.expect(2);

  options = {
    min: 1
  };

  builtOptions = validator.buildOptions(options);

  message = validator.validate([], builtOptions.toObject());
  assert.equal(message, 'This field is too short (minimum is 1 characters)');

  message = validator.validate([1], builtOptions.toObject());
  assert.equal(message, true);
});
