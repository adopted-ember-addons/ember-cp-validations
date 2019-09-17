import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Component | another-component', function(hooks) {
  setupTest(hooks);

  test('it creates correctly', async function(assert) {
    this.set('model', this.owner.lookup('service:store').createRecord('user', { username: 'joebloggs' }));

    this.owner.factoryFor('component:another-component').create({ model: this.model });
    assert.ok(true);
  });
});
