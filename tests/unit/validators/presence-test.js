import { moduleFor, test } from 'ember-qunit';

let options, builtOptions, validator, message;

moduleFor('validator:presence', 'Unit | Validator | presence', {
  needs: ['validator:messages'],
  setup() {
    validator = this.subject();
  }
});

test('buildOptions', function(assert) {
  assert.expect(2);

  options = true;
  builtOptions = validator.buildOptions(options, {});
  assert.equal(builtOptions.get('presence'), true);

  options = { presence: true };
  builtOptions = validator.buildOptions(options, {});
  assert.equal(builtOptions.get('presence'), true);
});

test('presence - value present', function(assert) {
  assert.expect(1);

  options = { presence: true };

  builtOptions = validator.buildOptions(options);

  message = validator.validate('value', builtOptions.copy());
  assert.equal(message, true);
});

test('presence - value blank', function(assert) {
  assert.expect(1);

  options = { presence: true };

  builtOptions = validator.buildOptions(options);

  message = validator.validate(' ', builtOptions.copy());
  assert.equal(message, true);
});

test('presence with ignoreBlank - value blank', function(assert) {
  assert.expect(1);

  options = { presence: true, ignoreBlank: true };

  builtOptions = validator.buildOptions(options);

  message = validator.validate(' ', builtOptions.copy());
  assert.equal(message, "This field can't be blank");
});

test('presence - value not present', function(assert) {
  assert.expect(1);

  options = { presence: true };
  builtOptions = validator.buildOptions(options);

  message = validator.validate(undefined, builtOptions.copy());
  assert.equal(message, "This field can't be blank");
});

test('absence - value present', function(assert) {
  assert.expect(1);

  options = { presence: false };
  builtOptions = validator.buildOptions(options);

  message = validator.validate('value', builtOptions.copy());
  assert.equal(message, 'This field must be blank');
});

test('absence - value not present', function(assert) {
  assert.expect(1);

  options = { presence: false };
  builtOptions = validator.buildOptions(options);

  message = validator.validate(undefined, builtOptions.copy());
  assert.equal(message, true);
});
