import Ember from 'ember';
import { module, test } from 'qunit';
import shouldCallSuper from 'ember-cp-validations/utils/should-call-super';

const {
  computed
} = Ember;

module('Unit | Utils | shouldCallSuper');

test('shouldCallSuper - true', function(assert) {
  let Parent = Ember.Object.extend({
    foo: computed(function() {})
  });

  let Child = Parent.extend({
    foo: computed(function() {
      assert.ok(shouldCallSuper(this, 'foo'));
    })
  });

  let child = Child.create();
  child.get('foo');
});

test('shouldCallSuper - false', function(assert) {
  let Parent = Ember.Object.extend();

  let Child = Parent.extend({
    foo: computed(function() {
      assert.ok(!shouldCallSuper(this, 'foo'));
    })
  });

  let child = Child.create();
  child.get('foo');
});
