import Ember from 'ember';
import {
  moduleForModel,
  test
}
from 'ember-qunit';

moduleForModel('signup', 'Unit | Validations | DS.Model', {
  needs: ['validator:presence']
});

test('create model with defaults', function(assert) {
  var object = this.subject();

  assert.equal(object.get('validations.attrs.acceptTerms.isDirty'), false, 'isDirty was expected to be FALSE');
  assert.equal(object.get('validations.attrs.acceptTerms.isValid'), false, 'isValid was expected to be FALSE');

  Ember.run(() => { object.set('acceptTerms', true); });

  assert.equal(object.get('validations.attrs.acceptTerms.isDirty'), true, 'isDirty was expected to be TRUE');
  assert.equal(object.get('validations.attrs.acceptTerms.isValid'), true, 'isValid was expected to be TRUE');
});

test('create model overriding defaults', function(assert) {
  var object = this.subject({acceptTerms: true});

  assert.equal(object.get('validations.attrs.acceptTerms.isDirty'), true, 'isDirty was expected to be TRUE');
  assert.equal(object.get('validations.attrs.acceptTerms.isValid'), true, 'isValid was expected to be TRUE');

  Ember.run(() => { object.set('acceptTerms', false); });

  assert.equal(object.get('validations.attrs.acceptTerms.isDirty'), false, 'isDirty was expected to be FALSE');
  assert.equal(object.get('validations.attrs.acceptTerms.isValid'), false, 'isValid was expected to be FALSE');
});
