import { click, fillIn, find, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { module, test } from 'qunit';

const validInputValues = {
  username: 'offirgolan',
  password: 'Pass123',
  email: 'offirgolan@gmail.com',
  emailConfirmation: 'offirgolan@gmail.com',
  firstName: 'Offir',
  lastName: 'Golan',
  dob: '1/1/1930',
};

module('Acceptance | Dummy | index', function (hooks) {
  setupApplicationTest(hooks);

  test('Page Loads', async function (assert) {
    assert.expect(2);
    await visit('/');

    assert.dom('a.navbar-brand').hasText('CP Validations');
    assert.dom('.form .register h2').hasText('Create an Account');
  });

  test('Helper tooltips', async function (assert) {
    assert.expect(2);
    await visit('/');

    assert.dom('.section .section-info').exists({ count: 3 });
    assert
      .dom(find('.section .section-info'))
      .includesText('These form inputs are bound to the User model');
  });

  test('Invalid form submit', async function (assert) {
    await visit('/');
    await click('[data-test-sign-up]');

    assert
      .dom('.form .alert')
      .hasText('Please fix all the errors below before continuing.');
  });

  test('Valid form submit', async function (assert) {
    assert.expect(16);
    await visit('/');

    for (let key in validInputValues) {
      const selector = `input[name='${key}']`;
      const input = find(selector);

      assert.ok(input, `${selector} found`);
      await fillIn(input, validInputValues[key]);
      assert.ok(
        find(selector).closest('.has-success'),
        `${selector} has the class 'has-success'`
      );
    }

    await click('[data-test-sign-up]');
    assert.dom('.form .registered .icon-success').exists();
    assert.dom('.form .registered h2.success').hasText('Success');
  });

  test('Invalid to valid email', async function (assert) {
    assert.expect(4);
    await visit('/');
    const selector = `input[name='email']`;
    const input = find(selector);

    assert.ok(input);
    await fillIn(input, 'invalid-email');

    assert.ok(
      find(selector).closest('.has-error'),
      `${selector} has the class 'has-error'`
    );
    assert
      .dom(`${selector} ~ .input-error`)
      .hasText('This field must be a valid email address');

    await fillIn(input, validInputValues.email);
    assert.ok(
      find(selector).closest('.has-success'),
      `${selector} has the class 'has-success'`
    );
  });
});
