import Ember from 'ember';
import DS from 'ember-data';
import { moduleForModel, test } from 'ember-qunit';

moduleForModel('order', 'Unit | Validations | Nested Model Relationships', {
  needs: [
    'validator:messages',
    'validator:ds-error',
    'validator:presence',
    'validator:number',
    'validator:has-many',
    'model:order-line',
    'model:order-selection',
    'model:order-selection-question'
  ]
});

test("order with invalid question shows invalid", function(assert) {
  assert.expect(7);
  var order = this.subject({source: 'external'});

  var orderLine, orderSelection, orderSelectionQuestion;

  let store = this.store();
  Ember.run(() => {
    orderLine = store.createRecord('order-line', { order: order, type: "item" });
    orderSelection = store.createRecord('order-selection', { order: order, line: orderLine, quantity: 1 });
    orderSelectionQuestion = store.createRecord('order-selection-question', { order: order, selection: orderSelection });
  });

  assert.equal(order.get('lines.length'), 1, 'Order has 1 Order Line');
  assert.equal(orderLine.get('selections.length'), 1, 'Order Line has 1 Order Selection');
  assert.equal(orderSelection.get('questions.length'), 1, 'Order Selection has 1 Order Selection Question');

  let done = assert.async();

  order.validate().then(({ validations }) => {
    assert.equal(validations.get('isValid'), false, 'Order should not be valid because of Order Selection Question');
    return orderLine.validate();
  }).then(({ validations }) => {
    assert.equal(validations.get('isValid'), false, 'Order Line should not be valid because of Order Selection Question');
    return orderSelection.validate();
  }).then(({ validations}) => {
    assert.equal(validations.get('isValid'), false, 'Order Selection should not be valid because of Order Selection Question');
    return orderSelectionQuestion.validate();
  }).then(({ validations}) => {
    assert.equal(validations.get('isValid'), false, 'Order Selection Question should not be valid');
    done();
  });
});

test("order with valid question shows valid", function(assert) {
  assert.expect(7);
  var order = this.subject({source: 'external'});

  var orderLine, orderSelection, orderSelectionQuestion;

  let store = this.store();
  Ember.run(() => {
    orderLine = store.createRecord('order-line', { order: order, type: "item" });
    orderSelection = store.createRecord('order-selection', { order: order, line: orderLine, quantity: 1 });
    orderSelectionQuestion = store.createRecord('order-selection-question', { order: order, selection: orderSelection, text: 'answer' });
  });

  assert.equal(order.get('lines.length'), 1, 'Order has 1 Order Line');
  assert.equal(orderLine.get('selections.length'), 1, 'Order Line has 1 Order Selection');
  assert.equal(orderSelection.get('questions.length'), 1, 'Order Selection has 1 Order Selection Question');

  let done = assert.async();

  order.validate().then(({ validations }) => {
    assert.equal(validations.get('isValid'), true, 'Order should be valid because of Order Selection Question');
    return orderLine.validate();
  }).then(({ validations }) => {
    assert.equal(validations.get('isValid'), true, 'Order Line should be valid because of Order Selection Question');
    return orderSelection.validate();
  }).then(({ validations}) => {
    assert.equal(validations.get('isValid'), true, 'Order Selection should be valid because of Order Selection Question');
    return orderSelectionQuestion.validate();
  }).then(({ validations}) => {
    assert.equal(validations.get('isValid'), true, 'Order Selection Question should be valid');
    done();
  });
});

test("order with invalid question shows invalid if validated in reverse order", function(assert) {
  assert.expect(7);
  var order = this.subject({source: 'external'});

  var orderLine, orderSelection, orderSelectionQuestion;

  let store = this.store();
  Ember.run(() => {
    orderLine = store.createRecord('order-line', { order: order, type: "item" });
    orderSelection = store.createRecord('order-selection', { order: order, line: orderLine, quantity: 1 });
    orderSelectionQuestion = store.createRecord('order-selection-question', { order: order, selection: orderSelection });
  });

  assert.equal(order.get('lines.length'), 1, 'Order has 1 Order Line');
  assert.equal(orderLine.get('selections.length'), 1, 'Order Line has 1 Order Selection');
  assert.equal(orderSelection.get('questions.length'), 1, 'Order Selection has 1 Order Selection Question');

  let done = assert.async();

  orderSelectionQuestion.validate().then(({ validations }) => {
    assert.equal(validations.get('isValid'), false, 'Order Selection Question should not be valid');
    return orderSelection.validate();
  }).then(({ validations }) => {
    assert.equal(validations.get('isValid'), false, 'Order Selection should not be valid because of Order Selection Question');
    return orderLine.validate();
  }).then(({ validations}) => {
    assert.equal(validations.get('isValid'), false, 'Order Line should not be valid because of Order Selection Question');
    return order.validate();
  }).then(({ validations}) => {
    assert.equal(validations.get('isValid'), false, 'Order should not be valid because of Order Selection Question');
    done();
  });
});

test("order with valid question shows valid if validated in reverse order", function(assert) {
  assert.expect(7);
  var order = this.subject({source: 'external'});

  var orderLine, orderSelection, orderSelectionQuestion;

  let store = this.store();
  Ember.run(() => {
    orderLine = store.createRecord('order-line', { order: order, type: "item" });
    orderSelection = store.createRecord('order-selection', { order: order, line: orderLine, quantity: 1 });
    orderSelectionQuestion = store.createRecord('order-selection-question', { order: order, selection: orderSelection, text: 'answer' });
  });

  assert.equal(order.get('lines.length'), 1, 'Order has 1 Order Line');
  assert.equal(orderLine.get('selections.length'), 1, 'Order Line has 1 Order Selection');
  assert.equal(orderSelection.get('questions.length'), 1, 'Order Selection has 1 Order Selection Question');

  let done = assert.async();

  orderSelectionQuestion.validate().then(({ validations }) => {
    assert.equal(validations.get('isValid'), true, 'Order Selection Question should be valid');
    return orderSelection.validate();
  }).then(({ validations }) => {
    assert.equal(validations.get('isValid'), true, 'Order Selection should be valid because of Order Selection Question');
    return orderLine.validate();
  }).then(({ validations}) => {
    assert.equal(validations.get('isValid'), true, 'Order Line should be valid because of Order Selection Question');
    return order.validate();
  }).then(({ validations}) => {
    assert.equal(validations.get('isValid'), true, 'Order should be valid because of Order Selection Question');
    done();
  });
});
