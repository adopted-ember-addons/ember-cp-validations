import { click, fillIn, findAll, find, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { module, test } from 'qunit';

const validInputValues = {
  username: 'offirgolan',
  password: 'Pass123',
  email: 'offirgolan@gmail.com',
  emailConfirmation: 'offirgolan@gmail.com',
  firstName: 'Offir',
  lastName: 'Golan',
  dob: '1/1/1930'
};

module('Acceptance | Dummy | index', function(hooks) {
  setupApplicationTest(hooks);

  test('Page Loads', async function(assert) {
    assert.expect(2);
    await visit('/');
    assert.dom('a.navbar-brand').hasText('CP Validations');
    assert.dom('.form .register h2').hasText('Create an Account');
  });

  test('Helper tooltips', async function(assert) {
    assert.expect(2);
    await visit('/');
    assert.dom('.section .section-info').exists({ count: 3 });
    assert.equal(
      findAll('.section .section-info')[0].textContent.trim().length > 0,
      true
    );
  });

  test('Invalid form submit', async function(assert) {
    await visit('/');
    await click('#signup');

    assert
      .dom('.form .alert')
      .hasText('Please fix all the errors below before continuing.');
  });

  test('Valid form submit', async function(assert) {
    await visit('/');
    Object.keys(validInputValues).forEach(async input => {
      let $input = find(`.validated-input input[name='${input}']`);
      assert.ok($input, `${input} found`);
      await fillIn($input, validInputValues[input]);
      assert.ok(
        $input.parent('.validated-input.has-success'),
        `${input} success`
      );
    });
    await click('#signup');
    assert.dom('.form .registered img.tomster').exists();
    assert.dom('.form .registered h2.success').hasText('Success');
  });

  test('Invalid to valid email', async function(assert) {
    assert.expect(4);
    await visit('/');
    let $input;
    $input = find('.validated-input input[name="email"]');
    assert.ok($input);
    await fillIn($input, 'invalid-email');
    assert.equal(
      $input
        .parent('.form-group')
        .find('.input-error .error')
        .text()
        .trim(),
      'This field must be a valid email address'
    );
    assert.ok($input.parent('.validated-input.has-error'));

    await fillIn($input, validInputValues.email);
    assert.ok($input.parent('.validated-input.has-success'));
  });
});
