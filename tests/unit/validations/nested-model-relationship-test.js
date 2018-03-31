import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Validations | Nested Model Relationships', function(hooks) {
  setupTest(hooks);

  test('order with invalid question shows invalid', function(assert) {
    assert.expect(11);
    let order = run(() =>
      this.owner
        .lookup('service:store')
        .createRecord('order', { source: 'external' })
    );

    let orderLine, orderSelection, orderSelectionQuestion;

    let store = this.owner.lookup('service:store');
    run(() => {
      orderLine = store.createRecord('order-line', { order, type: 'item' });
      orderSelection = store.createRecord('order-selection', {
        order,
        line: orderLine,
        quantity: 1
      });
      orderSelectionQuestion = store.createRecord('order-selection-question', {
        order,
        selection: orderSelection
      });
      store.createRecord('order-selection-question', {
        order,
        selection: orderSelection,
        text: 'foo'
      });
    });

    assert.equal(order.get('lines.length'), 1, 'Order has 1 Order Line');
    assert.equal(
      orderLine.get('selections.length'),
      1,
      'Order Line has 1 Order Selection'
    );
    assert.equal(
      orderSelection.get('questions.length'),
      2,
      'Order Selection has 2 Order Selection Questions'
    );

    let done = assert.async();

    order
      .validate()
      .then(({ validations }) => {
        assert.equal(
          validations.get('isValidating'),
          false,
          'All promises should be resolved'
        );
        assert.equal(
          validations.get('isValid'),
          false,
          'Order should not be valid because of Order Selection Question'
        );
        return orderLine.validate();
      })
      .then(({ validations }) => {
        assert.equal(
          validations.get('isValidating'),
          false,
          'All promises should be resolved'
        );
        assert.equal(
          validations.get('isValid'),
          false,
          'Order Line should not be valid because of Order Selection Question'
        );
        return orderSelection.validate();
      })
      .then(({ validations }) => {
        assert.equal(
          validations.get('isValidating'),
          false,
          'All promises should be resolved'
        );
        assert.equal(
          validations.get('isValid'),
          false,
          'Order Selection should not be valid because of Order Selection Question'
        );
        return orderSelectionQuestion.validate();
      })
      .then(({ validations }) => {
        assert.equal(
          validations.get('isValidating'),
          false,
          'All promises should be resolved'
        );
        assert.equal(
          validations.get('isValid'),
          false,
          'Order Selection Question should not be valid'
        );
        done();
      });
  });

  test('order with valid question shows valid', function(assert) {
    assert.expect(11);
    let order = run(() =>
      this.owner
        .lookup('service:store')
        .createRecord('order', { source: 'external' })
    );

    let orderLine, orderSelection, orderSelectionQuestion;

    let store = this.owner.lookup('service:store');
    run(() => {
      orderLine = store.createRecord('order-line', { order, type: 'item' });
      orderSelection = store.createRecord('order-selection', {
        order,
        line: orderLine,
        quantity: 1
      });
      orderSelectionQuestion = store.createRecord('order-selection-question', {
        order,
        selection: orderSelection,
        text: 'answer'
      });
    });

    assert.equal(order.get('lines.length'), 1, 'Order has 1 Order Line');
    assert.equal(
      orderLine.get('selections.length'),
      1,
      'Order Line has 1 Order Selection'
    );
    assert.equal(
      orderSelection.get('questions.length'),
      1,
      'Order Selection has 1 Order Selection Question'
    );

    let done = assert.async();

    order
      .validate()
      .then(({ validations }) => {
        assert.equal(
          validations.get('isValidating'),
          false,
          'All promises should be resolved'
        );
        assert.equal(
          validations.get('isValid'),
          true,
          'Order should be valid because of Order Selection Question'
        );
        return orderLine.validate();
      })
      .then(({ validations }) => {
        assert.equal(
          validations.get('isValidating'),
          false,
          'All promises should be resolved'
        );
        assert.equal(
          validations.get('isValid'),
          true,
          'Order Line should be valid because of Order Selection Question'
        );
        return orderSelection.validate();
      })
      .then(({ validations }) => {
        assert.equal(
          validations.get('isValidating'),
          false,
          'All promises should be resolved'
        );
        assert.equal(
          validations.get('isValid'),
          true,
          'Order Selection should be valid because of Order Selection Question'
        );
        return orderSelectionQuestion.validate();
      })
      .then(({ validations }) => {
        assert.equal(
          validations.get('isValidating'),
          false,
          'All promises should be resolved'
        );
        assert.equal(
          validations.get('isValid'),
          true,
          'Order Selection Question should be valid'
        );
        done();
      });
  });

  test('order with invalid question shows invalid if validated in reverse order', function(assert) {
    assert.expect(11);
    let order = run(() =>
      this.owner
        .lookup('service:store')
        .createRecord('order', { source: 'external' })
    );

    let orderLine, orderSelection, orderSelectionQuestion;

    let store = this.owner.lookup('service:store');
    run(() => {
      orderLine = store.createRecord('order-line', { order, type: 'item' });
      orderSelection = store.createRecord('order-selection', {
        order,
        line: orderLine,
        quantity: 1
      });
      orderSelectionQuestion = store.createRecord('order-selection-question', {
        order,
        selection: orderSelection
      });
    });

    assert.equal(order.get('lines.length'), 1, 'Order has 1 Order Line');
    assert.equal(
      orderLine.get('selections.length'),
      1,
      'Order Line has 1 Order Selection'
    );
    assert.equal(
      orderSelection.get('questions.length'),
      1,
      'Order Selection has 1 Order Selection Question'
    );

    let done = assert.async();

    orderSelectionQuestion
      .validate()
      .then(({ validations }) => {
        assert.equal(
          validations.get('isValidating'),
          false,
          'All promises should be resolved'
        );
        assert.equal(
          validations.get('isValid'),
          false,
          'Order Selection Question should not be valid'
        );
        return orderSelection.validate();
      })
      .then(({ validations }) => {
        assert.equal(
          validations.get('isValidating'),
          false,
          'All promises should be resolved'
        );
        assert.equal(
          validations.get('isValid'),
          false,
          'Order Selection should not be valid because of Order Selection Question'
        );
        return orderLine.validate();
      })
      .then(({ validations }) => {
        assert.equal(
          validations.get('isValidating'),
          false,
          'All promises should be resolved'
        );
        assert.equal(
          validations.get('isValid'),
          false,
          'Order Line should not be valid because of Order Selection Question'
        );
        return order.validate();
      })
      .then(({ validations }) => {
        assert.equal(
          validations.get('isValidating'),
          false,
          'All promises should be resolved'
        );
        assert.equal(
          validations.get('isValid'),
          false,
          'Order should not be valid because of Order Selection Question'
        );
        done();
      });
  });

  test('order with valid question shows valid if validated in reverse order', function(assert) {
    assert.expect(11);
    let order = run(() =>
      this.owner
        .lookup('service:store')
        .createRecord('order', { source: 'external' })
    );

    let orderLine, orderSelection, orderSelectionQuestion;

    let store = this.owner.lookup('service:store');
    run(() => {
      orderLine = store.createRecord('order-line', { order, type: 'item' });
      orderSelection = store.createRecord('order-selection', {
        order,
        line: orderLine,
        quantity: 1
      });
      orderSelectionQuestion = store.createRecord('order-selection-question', {
        order,
        selection: orderSelection,
        text: 'answer'
      });
    });

    assert.equal(order.get('lines.length'), 1, 'Order has 1 Order Line');
    assert.equal(
      orderLine.get('selections.length'),
      1,
      'Order Line has 1 Order Selection'
    );
    assert.equal(
      orderSelection.get('questions.length'),
      1,
      'Order Selection has 1 Order Selection Question'
    );

    let done = assert.async();

    orderSelectionQuestion
      .validate()
      .then(({ validations }) => {
        assert.equal(
          validations.get('isValidating'),
          false,
          'All promises should be resolved'
        );
        assert.equal(
          validations.get('isValid'),
          true,
          'Order Selection Question should be valid'
        );
        return orderSelection.validate();
      })
      .then(({ validations }) => {
        assert.equal(
          validations.get('isValidating'),
          false,
          'All promises should be resolved'
        );
        assert.equal(
          validations.get('isValid'),
          true,
          'Order Selection should be valid because of Order Selection Question'
        );
        return orderLine.validate();
      })
      .then(({ validations }) => {
        assert.equal(
          validations.get('isValidating'),
          false,
          'All promises should be resolved'
        );
        assert.equal(
          validations.get('isValid'),
          true,
          'Order Line should be valid because of Order Selection Question'
        );
        return order.validate();
      })
      .then(({ validations }) => {
        assert.equal(
          validations.get('isValidating'),
          false,
          'All promises should be resolved'
        );
        assert.equal(
          validations.get('isValid'),
          true,
          'Order should be valid because of Order Selection Question'
        );
        done();
      });
  });

  test('order with invalid question shows valid if invalid question is deleted in reverse order', function(assert) {
    assert.expect(9);
    let order = run(() =>
      this.owner
        .lookup('service:store')
        .createRecord('order', { id: 1, source: 'external' })
    );

    let orderLine,
      orderSelection,
      orderSelectionQuestion,
      orderSelectionQuestion2;

    let store = this.owner.lookup('service:store');
    run(() => {
      let fakeSave = function(model) {
        model.get('_internalModel').adapterWillCommit();
        model.get('_internalModel').adapterDidCommit();
      };

      orderLine = store.createRecord('order-line', {
        id: 1,
        order,
        type: 'item'
      });
      orderSelection = store.createRecord('order-selection', {
        id: 1,
        order,
        line: orderLine,
        quantity: 1
      });
      orderSelectionQuestion = store.createRecord('order-selection-question', {
        id: 1,
        order,
        selection: orderSelection,
        text: 'answer'
      });
      orderSelectionQuestion2 = store.createRecord('order-selection-question', {
        id: 2,
        order,
        selection: orderSelection
      });

      fakeSave(order);
      fakeSave(orderLine);
      fakeSave(orderSelection);
      fakeSave(orderSelectionQuestion);
      fakeSave(orderSelectionQuestion2);
    });

    assert.equal(order.get('lines.length'), 1, 'Order has 1 Order Line');
    assert.equal(
      orderLine.get('selections.length'),
      1,
      'Order Line has 1 Order Selection'
    );
    assert.equal(
      orderSelection.get('questions.length'),
      2,
      'Order Selection has 2 Order Selection Question'
    );

    let done = assert.async();

    orderSelectionQuestion2
      .validate()
      .then(({ validations }) => {
        assert.equal(
          validations.get('isValid'),
          false,
          'Order Selection Question 2 should be invalid'
        );

        return orderSelectionQuestion.validate();
      })
      .then(({ validations }) => {
        assert.equal(
          validations.get('isValid'),
          true,
          'Order Selection Question should be valid'
        );

        return orderSelection.validate();
      })
      .then(({ validations }) => {
        assert.equal(
          validations.get('isValid'),
          false,
          'Order Selection should be invalid because of Order Selection Question 2'
        );
        orderSelectionQuestion2.deleteRecord();

        return orderSelection.validate();
      })
      .then(({ validations }) => {
        assert.equal(
          validations.get('isValid'),
          true,
          'Order Selection should be valid because invalid Order Selection Question 2 was marked deleted'
        );

        orderSelectionQuestion.deleteRecord();
        return orderSelection.validate();
      })
      .then(() => {
        assert.equal(
          orderSelection.get('validations.attrs.questions.isValid'),
          false,
          'Order Selection should not be valid because all Order Selection Questions have been marked deleted'
        );

        order.deleteRecord();
        return orderSelection.validate();
      })
      .then(() => {
        assert.equal(
          orderSelection.get('validations.attrs.order.isValid'),
          false,
          'Order Selection should not be valid because Order was marked for deletion'
        );

        done();
      });
  });
});
