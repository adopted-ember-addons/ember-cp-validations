import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | v-get', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    let model = EmberObject.create({
      validations: {
        isValid: false,
        isInvalid: true,
        attrs: {
          username: {
            isValid: false,
            message: 'This field is invalid',
          },
          email: {
            isValid: true,
          },
        },
      },
    });

    this.set('model', model);
  });

  test('it renders', async function (assert) {
    assert.expect(1);

    await render(hbs`{{v-get this.model 'isValid'}}`);
    assert.dom(this.element).hasText('false');
  });

  test('access attribute validations', async function (assert) {
    assert.expect(3);

    await render(hbs`{{v-get this.model 'username' 'isValid'}}`);
    assert.dom(this.element).hasText('false');

    await render(hbs`{{v-get this.model 'username' 'message'}}`);
    assert.dom(this.element).hasText('This field is invalid');

    await render(hbs`{{v-get this.model 'email' 'isValid'}}`);
    assert.dom(this.element).hasText('true');
  });

  test('updating validation should rerender', async function (assert) {
    assert.expect(2);

    await render(hbs`{{v-get this.model 'username' 'isValid'}}`);
    assert.dom(this.element).hasText('false');

    this.set('model.validations.attrs.username.isValid', true);

    assert.dom(this.element).hasText('true');
  });

  test('block statement param', async function (assert) {
    assert.expect(2);

    await render(hbs`
      {{#if (v-get this.model 'email' 'isValid')}}
        Email address is valid
      {{/if}}
    `);

    assert.dom(this.element).hasText('Email address is valid');

    await render(hbs`
      {{#unless (v-get this.model 'username' 'isValid')}}
        {{v-get this.model 'username' 'message'}}
      {{/unless}}
    `);

    assert.dom(this.element).hasText('This field is invalid');
  });

  test('element node attribute', async function (assert) {
    assert.expect(2);

    await render(
      hbs`<button type="button" disabled={{v-get this.model 'isInvalid'}}>Button</button>`,
    );

    assert.dom(this.element).hasText('Button');
    assert.true(this.element.querySelector('button').disabled);
  });

  test('element node attribute in class string', async function (assert) {
    assert.expect(3);

    await render(
      hbs`<span class="base {{if (v-get this.model 'isInvalid') 'has-error'}}">Text</span>`,
    );

    assert.dom(this.element).hasText('Text');
    assert
      .dom(this.element.querySelector('span'))
      .hasClass('base', 'base class present');
    assert
      .dom(this.element.querySelector('span'))
      .hasClass('has-error', 'error class present');
  });

  test('access validations with named args', async function (assert) {
    assert.expect(2);

    await render(hbs`<NamedVGet @model={{this.model}} @field='isValid' />`);
    assert.dom(this.element).hasText('false');

    await render(
      hbs`<NamedVGet @model={{this.model}} @attr='username' @field='isValid' />`,
    );
    assert.dom(this.element).hasText('false');
  });
});
