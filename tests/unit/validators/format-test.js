import { moduleFor, test } from 'ember-qunit';

let options, builtOptions, validator, message;

moduleFor('validator:format', 'Unit | Validator | format', {
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
    type: 'email'
  };
  options = validator.buildOptions(options, {}).copy();

  message = validator.validate(undefined, options);
  assert.equal(message, true);

  message = validator.validate('email', options);
  assert.equal(message, 'This field must be a valid email address');
});

test('email no option', function(assert) {
  let validAddresses = [
    'email@domain.com',
    'firstname.lastname@domain.com',
    'email@subdomain.domain.com',
    'firstname+lastname@domain.com',
    '1234567890@domain.com',
    'email@domain-one.com',
    '_______@domain.com',
    'email@domain.name',
    'email@domain.co.jp',
    'firstname-lastname@domain.com',
    'EMAIL@DOMAIN.COM'
  ];
  let invalidAddresses = [
    'plainaddress',
    '#@%^%#$@#$@#.com',
    '@domain.com',
    'Joe Smith <email@domain.com>',
    'email.domain.com',
    'email@domain@domain.com',
    '.email@domain.com',
    'email.@domain.com',
    'email..email@domain.com',
    'あいうえお@domain.com',
    'email@domain.com (Joe Smith)',
    'email@domain',
    'email@domain.',
    'email@domain.-',
    'email@domain-',
    'email@domain-.',
    'email@domain.com.',
    'email@domain.com.-',
    'email@domain.com-',
    'email@domain.com-.',
    'email@-domain.com',
    'email@domain..com'
  ];

  assert.expect(validAddresses.length + invalidAddresses.length);

  options = {
    type: 'email'
  };

  options = validator.buildOptions(options, {}).copy();

  validAddresses.forEach(email =>
    assert.equal(
      validator.validate(email, options),
      true,
      `validation of ${email} must succeed`
    )
  );
  invalidAddresses.forEach(email =>
    assert.equal(
      validator.validate(email, options),
      'This field must be a valid email address',
      `validation of ${email} must fail`
    )
  );
});

test('email option allowNonTld', function(assert) {
  let validAddresses = [
    'email@domain.com',
    'firstname.lastname@domain.com',
    'email@subdomain.domain.com',
    'firstname+lastname@domain.com',
    '1234567890@domain.com',
    'email@domain-one.com',
    '_______@domain.com',
    'email@domain.name',
    'email@domain.co.jp',
    'firstname-lastname@domain.com',
    'EMAIL@DOMAIN.COM',
    'email@domain'
  ];
  let invalidAddresses = [
    'plainaddress',
    '#@%^%#$@#$@#.com',
    '@domain.com',
    'Joe Smith <email@domain.com>',
    'email.domain.com',
    'email@domain@domain.com',
    '.email@domain.com',
    'email.@domain.com',
    'email..email@domain.com',
    'あいうえお@domain.com',
    'email@domain.com (Joe Smith)',
    'email@domain.',
    'email@domain.-',
    'email@domain-',
    'email@domain-.',
    'email@domain.com.',
    'email@domain.com.-',
    'email@domain.com-',
    'email@domain.com-.',
    'email@-domain.com',
    'email@domain..com'
  ];

  assert.expect(validAddresses.length + invalidAddresses.length);

  options = {
    type: 'email',
    allowNonTld: true
  };

  options = validator.buildOptions(options, {}).copy();

  validAddresses.forEach(email =>
    assert.equal(
      validator.validate(email, options),
      true,
      `validation of ${email} must succeed`
    )
  );
  invalidAddresses.forEach(email =>
    assert.equal(
      validator.validate(email, options),
      'This field must be a valid email address',
      `validation of ${email} must fail`
    )
  );
});

test('phone', function(assert) {
  assert.expect(2);

  options = {
    type: 'phone'
  };

  options = validator.buildOptions(options, {}).copy();

  message = validator.validate('123', options);
  assert.equal(message, 'This field must be a valid phone number');

  message = validator.validate('(408) 555-1234', options);
  assert.equal(message, true);
});

test('url', function(assert) {
  assert.expect(2);

  options = {
    type: 'url'
  };

  options = validator.buildOptions(options, {}).copy();

  message = validator.validate('offirgolan', options);
  assert.equal(message, 'This field must be a valid url');

  message = validator.validate('http://www.offirgolan.com', options);
  assert.equal(message, true);
});

test('custom', function(assert) {
  assert.expect(2);

  options = {
    regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$/
  };

  options = validator.buildOptions(options, {}).copy();

  message = validator.validate('password', options);
  assert.equal(message, 'This field is invalid');

  message = validator.validate('Pass123', options);
  assert.equal(message, true);
});
