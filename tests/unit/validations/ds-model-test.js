import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Validations | Model', function (hooks) {
  setupTest(hooks);

  test('create model with defaults', function (assert) {
    let object = run(() =>
      this.owner.lookup('service:store').createRecord('signup'),
    );

    assert.false(
      object.get('validations.attrs.acceptTerms.isValid'),
      'isValid was expected to be FALSE',
    );

    run(() => {
      object.set('acceptTerms', true);
    });

    assert.true(
      object.get('validations.attrs.acceptTerms.isValid'),
      'isValid was expected to be TRUE',
    );
  });

  test('create model overriding defaults', function (assert) {
    let object = run(() =>
      this.owner
        .lookup('service:store')
        .createRecord('signup', { acceptTerms: true }),
    );

    assert.true(
      object.get('validations.attrs.acceptTerms.isValid'),
      'isValid was expected to be TRUE',
    );

    run(() => {
      object.set('acceptTerms', false);
    });

    assert.false(
      object.get('validations.attrs.acceptTerms.isValid'),
      'isValid was expected to be FALSE',
    );
  });
});
