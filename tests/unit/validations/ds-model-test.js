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
      object.get('validations.attrs.acceptTerms.isDirty'),
      false,
      'isDirty was expected to be FALSE'
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
      object.get('validations.attrs.acceptTerms.isDirty'),
      true,
      'isDirty was expected to be TRUE'
    );
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
      object.get('validations.attrs.acceptTerms.isDirty'),
      true,
      'isDirty was expected to be TRUE'
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
      object.get('validations.attrs.acceptTerms.isDirty'),
      false,
      'isDirty was expected to be FALSE'
    );
    assert.equal(
      object.get('validations.attrs.acceptTerms.isValid'),
      false,
      'isValid was expected to be FALSE'
    );
  });
});
