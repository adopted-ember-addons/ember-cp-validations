import { moduleFor, test } from 'ember-qunit';

let options, builtOptions, validator, message;

moduleFor('validator:inclusion', 'Unit | Validator | inclusion', {
  needs: ['validator:messages'],
  setup() {
    validator = this.subject();
  }
});

test('no options', function(assert) {
  assert.expect(1);

  builtOptions = validator.buildOptions({}).copy();

  try {
    message = validator.validate(undefined, builtOptions);
  } catch (e) {
    assert.ok(true);
  }
});

test('allow blank', function(assert) {
  assert.expect(2);

  options = {
    allowBlank: true,
    in: ['foo', 'bar', 'baz']
  };
  builtOptions = validator.buildOptions(options);

  message = validator.validate('', builtOptions.copy());
  assert.equal(message, true);

  message = validator.validate('test', builtOptions.copy());
  assert.equal(message, 'This field is not included in the list');
});

test('in array', function(assert) {
  assert.expect(4);

  options = {
    in: ['foo', 'bar', 'baz']
  };
  builtOptions = validator.buildOptions(options);

  message = validator.validate('test', builtOptions.copy());
  assert.equal(message, 'This field is not included in the list');

  message = validator.validate('foo', builtOptions.copy());
  assert.equal(message, true);

  message = validator.validate('bar', builtOptions.copy());
  assert.equal(message, true);

  message = validator.validate('baz', builtOptions.copy());
  assert.equal(message, true);
});

test('in range', function(assert) {
  assert.expect(5);

  options = {
    range: [1, 10]
  };
  builtOptions = validator.buildOptions(options);

  message = validator.validate(0, builtOptions.copy());
  assert.equal(message, 'This field is not included in the list');

  message = validator.validate(100, builtOptions.copy());
  assert.equal(message, 'This field is not included in the list');

  message = validator.validate(1, builtOptions.copy());
  assert.equal(message, true);

  message = validator.validate(5, builtOptions.copy());
  assert.equal(message, true);

  message = validator.validate(10, builtOptions.copy());
  assert.equal(message, true);
});

test('range type check - number', function(assert) {
  assert.expect(7);

  options = {
    range: [1, 10]
  };
  builtOptions = validator.buildOptions(options);

  message = validator.validate('0', builtOptions.copy());
  assert.equal(message, 'This field is not included in the list');

  message = validator.validate(0, builtOptions.copy());
  assert.equal(message, 'This field is not included in the list');

  message = validator.validate('1', builtOptions.copy());
  assert.equal(message, 'This field is not included in the list');

  message = validator.validate('5', builtOptions.copy());
  assert.equal(message, 'This field is not included in the list');

  message = validator.validate(1, builtOptions.copy());
  assert.equal(message, true);

  message = validator.validate(5, builtOptions.copy());
  assert.equal(message, true);

  message = validator.validate(10, builtOptions.copy());
  assert.equal(message, true);
});

test('range type check - string', function(assert) {
  assert.expect(5);

  options = {
    range: ['a', 'z']
  };
  builtOptions = validator.buildOptions(options);

  message = validator.validate(97, builtOptions.copy());
  assert.equal(message, 'This field is not included in the list');

  message = validator.validate('zzz', builtOptions.copy());
  assert.equal(message, 'This field is not included in the list');

  message = validator.validate('a', builtOptions.copy());
  assert.equal(message, true);

  message = validator.validate('o', builtOptions.copy());
  assert.equal(message, true);

  message = validator.validate('z', builtOptions.copy());
  assert.equal(message, true);
});
