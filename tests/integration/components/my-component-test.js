import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | my-component', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.set('model', this.owner.lookup('service:store').createRecord('user', { username: 'joebloggs' }));

    await render(hbs`<MyComponent @model={{this.model}} />`);
    assert.ok(true);
  });
});
