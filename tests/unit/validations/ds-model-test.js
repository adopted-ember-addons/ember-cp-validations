import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Validations | DS.Model', function(hooks) {
  setupTest(hooks);

  test('create model with defaults', function(assert) {
    let object = run(() =>
      this.owner.lookup('service:store').createRecord('signup')
    );

    assert.equal(
      object.get('validations.attrs.acceptTerms.isValid'),
      false,
      'isValid was expected to be FALSE'
    );

    run(() => {
      object.set('acceptTerms', true);
    });

    assert.equal(
      object.get('validations.attrs.acceptTerms.isValid'),
      true,
      'isValid was expected to be TRUE'
    );
  });

  test('create model overriding defaults', function(assert) {
    let object = run(() =>
      this.owner
        .lookup('service:store')
        .createRecord('signup', { acceptTerms: true })
    );

    assert.equal(
      object.get('validations.attrs.acceptTerms.isValid'),
      true,
      'isValid was expected to be TRUE'
    );

    run(() => {
      object.set('acceptTerms', false);
    });

    assert.equal(
      object.get('validations.attrs.acceptTerms.isValid'),
      false,
      'isValid was expected to be FALSE'
    );
  });

  test('for es6 class style model with decorator declaring validations', function(assert) {
    let company = run(() => {
      return this.owner.lookup('service:store').createRecord('company');
    });

    run(() => company.setProperties({ name: null }));

    assert.equal(
      company.get('validations.attrs.name.isValid'),
      false,
      'isValid => FALSE'
    );

    run(() => company.setProperties({ name: 'dude' }));

    assert.equal(company.get('validations.isValid'), true, 'isValid => TRUE');
  });
});
