import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
let App;

const validInputValues = {
  username: 'offirgolan',
  password: 'Pass123',
  email: 'offirgolan@gmail.com',
  emailConfirmation: 'offirgolan@gmail.com',
  firstName: 'Offir',
  lastName: 'Golan',
  dob: '1/1/1930'
};

module('Acceptance | Dummy | index', {
  beforeEach() {
    App = startApp();
  },
  afterEach() {
    run(App, App.destroy);
  }
});

test('Page Loads', function(assert) {
  assert.expect(2);
  visit('/');
  andThen(function() {
    assert.equal(find('a.navbar-brand').text().trim(), 'CP Validations');
    assert.equal(find('.form .register h2').text(), 'Create an Account');
  });
});

test('Helper tooltips', function(assert) {
  assert.expect(2);
  visit('/');
  andThen(function() {
    assert.equal(find('.section .section-info').length, 3);
    assert.equal(find('.section .section-info:first').text().trim().length > 0, true);
  });
});

test('Invalid form submit', function(assert) {
  visit('/');
  andThen(function() {
    click('#signup');
  });

  andThen(function() {
    assert.equal(find('.form .alert').text().trim(), 'Please fix all the errors below before continuing.');
  });
});

test('Valid form submit', function(assert) {
  visit('/');
  andThen(function() {
    Object.keys(validInputValues).forEach((input) => {
      let $input = find(`.validated-input input[name='${input}']`);
      assert.ok($input, `${input} found`);
      fillIn($input, validInputValues[input]);
      assert.ok($input.parent('.validated-input.has-success'), `${input} success`);
    });
    click('#signup');
  });

  andThen(function() {
    assert.ok(find('.form .registered img.tomster'));
    assert.equal(find('.form .registered h2.success').text(), 'Success');
  });
});

test('Invalid to valid email', function(assert) {
  assert.expect(4);
  visit('/');
  let $input;
  andThen(function() {
    $input = find('.validated-input input[name="email"]');
    assert.ok($input);
    fillIn($input, 'invalid-email');
  });

  andThen(function() {
    assert.equal($input.parent('.form-group').find('.input-error .error').text().trim(), 'This field must be a valid email address');
    assert.ok($input.parent('.validated-input.has-error'));

    fillIn($input, validInputValues.email);
    assert.ok($input.parent('.validated-input.has-success'));
  });
});
