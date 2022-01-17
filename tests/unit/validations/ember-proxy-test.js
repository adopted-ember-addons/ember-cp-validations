import ObjectProxy from '@ember/object/proxy';
import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { buildValidations, validator } from 'ember-cp-validations';

module('Unit | Validations | Ember ObjectProxy', function (hooks) {
  setupTest(hooks);

  test('extend ObjectProxy with validations', function (assert) {
    assert.expect(4);

    run(() => {
      let company = this.owner.lookup('service:store').createRecord('company');

      const container = this.owner.ownerInjection();

      @buildValidations({
        name: validator('presence', { presence: true, description: 'Name' }),
      })
      class Proxy extends ObjectProxy {}

      const proxy = new Proxy(container, { content: company });

      assert.notOk(proxy.get('validations.isValid'));
      assert.notOk(company.get('validations.isValid'));

      proxy.set('name', 'whatever');

      assert.ok(proxy.get('validations.isValid'));
      assert.ok(company.get('validations.isValid'));
    });
  });
});
