import Ember from 'ember';
import { module, test } from 'qunit';
import assign from 'ember-cp-validations/utils/assign';

module('Unit | Utils | assign');

test('single level', function(assert) {
  let obj = {};
  assign(obj, 'foo.bar', 1);
  assert.deepEqual(obj, { foo: { bar: 1 } });
});

test('single level - ember object', function(assert) {
  let obj = Ember.Object.create();
  assign(obj, 'foo.bar', 1, true);
  assert.ok(obj.foo instanceof Ember.Object);
  assert.equal(obj.get('foo.bar'), 1);
});

test('single level - ember object w/ CP', function(assert) {
  let obj = Ember.Object.create();
  assign(obj, 'foo.bar', Ember.computed(() =>  1), true);
  assert.ok(obj.foo instanceof Ember.Object);
  assert.equal(obj.get('foo.bar'), 1);
});

test('multi level', function(assert) {
  let obj = {};
  assign(obj, 'foo.bar.baz.boo', 1);
  assert.deepEqual(obj, { foo: { bar: { baz: { boo: 1 } } } });
});

test('multi level - ember object', function(assert) {
  let obj = Ember.Object.create();
  assign(obj, 'foo.bar.baz.boo', 1, true);
  assert.ok(obj.foo.bar.baz instanceof Ember.Object);
  assert.equal(obj.get('foo.bar.baz.boo'), 1);
});
