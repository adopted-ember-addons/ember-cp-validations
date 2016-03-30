import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

let validator, model, key;

moduleFor('validator:presence-or', 'Unit | Validator | presence-or', {
  needs: ['validator:messages'],
  setup: function() {
    key = 'foo';
    model = Ember.Object.create({ [key]: 'bar' });
    validator = this.subject({ attribute: 'stuff' });
  }
});

test('presence - values present', function(assert) {
  assert.expect(1);

  const options = { presence: true, dependentKeys: [key] };
  const message = validator.validate('value', options, model);
  assert.equal(message, true);
});

test('presence - values not present', function(assert) {
  assert.expect(1);

  model.set(key, undefined);
  const options = { presence: true, dependentKeys: [key] };
  const message = validator.validate(undefined, options, model);
  assert.equal(message, `At least one of these attributes must be present: ${validator.get('attribute')}, ${key}`);
});

test('presence - values not present - belongsTo', function(assert) {
  assert.expect(1);
  const promiseObject = {
    get() {
      return null;
    },

    constructor: {
      toString() {
        return 'DS.PromiseObject';
      }
    }
  };

  model.set(key, promiseObject);
  const options = { presence: true, dependentKeys: [key] };
  const message = validator.validate(undefined, options, model);
  assert.equal(message, `At least one of these attributes must be present: ${validator.get('attribute')}, ${key}`);
});

test('presence - values not present - hasMany', function(assert) {
  assert.expect(1);
  const promiseArray = {
    get() {
      return [];
    },

    constructor: {
      toString() {
        return 'DS.PromiseArray';
      }
    }
  };

  model.set(key, promiseArray);
  const options = { presence: true, dependentKeys: [key] };
  const message = validator.validate(undefined, options, model);
  assert.equal(message, `At least one of these attributes must be present: ${validator.get('attribute')}, ${key}`);
});

test('presence undefined - values present', function(assert) {
  assert.expect(1);

  const options = { dependentKeys: [key] };
  const message = validator.validate('value', options, model);
  assert.equal(message, true);
});

test('presence undefined - values not present', function(assert) {
  assert.expect(1);

  model.set(key, undefined);
  const options = { dependentKeys: [key] };
  const message = validator.validate(undefined, options, model);
  assert.equal(message, `At least one of these attributes must be present: ${validator.get('attribute')}, ${key}`);
});

test('absence - values present', function(assert) {
  assert.expect(1);

  const options = { presence: false, dependentKeys: [key] };
  const message = validator.validate('value', options, model);
  assert.equal(message, `All of these attributes must be blank: ${validator.get('attribute')}, ${key}`);
});

test('absence - values not present', function(assert) {
  assert.expect(1);

  model.set(key, undefined);
  const options = { presence: false, dependentKeys: [key] };
  const message = validator.validate(undefined, options, model);
  assert.equal(message, true);
});

test('exclusive presence - values present', function(assert) {
  assert.expect(1);

  const options = { presence: true, dependentKeys: [key], exclusive: true };
  const message = validator.validate('value', options, model);
  assert.equal(message, `Exactly one of these attributes must be present: ${validator.get('attribute')}, ${key}`);
});

test('exclusive presence - one value present', function(assert) {
  assert.expect(1);

  const options = { presence: true, dependentKeys: [key], exclusive: true };
  const message = validator.validate(undefined, options, model);
  assert.equal(message, true);
});

test('exclusive presence - values not present', function(assert) {
  assert.expect(1);

  model.set(key, undefined);
  const options = { presence: true, dependentKeys: [key], exclusive: true };
  const message = validator.validate(undefined, options, model);
  assert.equal(message, `Exactly one of these attributes must be present: ${validator.get('attribute')}, ${key}`);
});

test('exclusive presence undefined - values present', function(assert) {
  assert.expect(1);

  const options = { dependentKeys: [key], exclusive: true };
  const message = validator.validate('value', options, model);
  assert.equal(message, `Exactly one of these attributes must be present: ${validator.get('attribute')}, ${key}`);
});

test('exclusive presence undefined - one value present', function(assert) {
  assert.expect(1);

  const options = { dependentKeys: [key], exclusive: true };
  const message = validator.validate(undefined, options, model);
  assert.equal(message, true);
});

test('exclusive presence undefined - values not present', function(assert) {
  assert.expect(1);

  model.set(key, undefined);
  const options = { dependentKeys: [key], exclusive: true };
  const message = validator.validate(undefined, options, model);
  assert.equal(message, `Exactly one of these attributes must be present: ${validator.get('attribute')}, ${key}`);
});

test('exclusive absence - values present', function(assert) {
  assert.expect(1);

  const options = { presence: false, dependentKeys: [key], exclusive: true };
  const message = validator.validate('value', options, model);
  assert.equal(message, true);
});

test('exclusive absence - one value present', function(assert) {
  assert.expect(1);

  const options = { presence: false, dependentKeys: [key], exclusive: true };
  const message = validator.validate(undefined, options, model);
  assert.equal(message, `More than one or none of these attributes must be present: ${validator.get('attribute')}, ${key}`);
});

test('exclusive absence - values not present', function(assert) {
  assert.expect(1);

  model.set(key, undefined);
  const options = { presence: false, dependentKeys: [key], exclusive: true };
  const message = validator.validate(undefined, options, model);
  assert.equal(message, true);
});
