import ObjectProxy from '@ember/object/proxy';
import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { Validations } from 'dummy/models/company';

module('Unit | Validations | Ember ObjectProxy', function(hooks) {
  setupTest(hooks);

  test('extend ObjectProxy with validations', function(assert) {
    run(() => {
      let company = this.owner.lookup('service:store').createRecord('company');

      const container = this.owner.ownerInjection();
      const proxy = ObjectProxy.extend(Validations).create(container, {
        content: company
      });

      assert.notOk(proxy.get('validations.isValid'));
      assert.notOk(company.get('validations.isValid'));

      proxy.set('name', 'whatever');

      assert.ok(proxy.get('validations.isValid'));
      assert.ok(company.get('validations.isValid'));
    });
  });
});
