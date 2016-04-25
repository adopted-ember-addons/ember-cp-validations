import Ember from 'ember';
import { module, test } from 'qunit';
import shouldCallSuper from 'ember-cp-validations/utils/should-call-super';

const {
  computed
} = Ember;

module('Unit | Utils | shouldCallSuper');

test('shouldCallSuper - true', function(assert) {
  const Parent = Ember.Object.extend({
    foo: computed(function() {})
  });

  const Child = Parent.extend({
    foo: computed(function() {
      assert.ok(shouldCallSuper(this, 'foo'));
    })
  });

  const child = Child.create();
  child.get('foo');
});

test('shouldCallSuper - false', function(assert) {
  const Parent = Ember.Object.extend();

  const Child = Parent.extend({
    foo: computed(function() {
      assert.ok(!shouldCallSuper(this, 'foo'));
    })
  });

  const child = Child.create();
  child.get('foo');
});
