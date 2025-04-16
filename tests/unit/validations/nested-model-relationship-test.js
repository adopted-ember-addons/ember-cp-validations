import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Validations | Nested Model Relationships', function (hooks) {
  setupTest(hooks);

  test('order with invalid question shows invalid', function (assert) {
    assert.expect(11);
    let order = run(() =>
      this.owner
        .lookup('service:store')
        .createRecord('order', { source: 'external' }),
    );

    let orderLine, orderSelection, orderSelectionQuestion;

    let store = this.owner.lookup('service:store');
    run(() => {
      orderLine = store.createRecord('order-line', { order, type: 'item' });
      orderSelection = store.createRecord('order-selection', {
        order,
        line: orderLine,
        quantity: 1,
      });
      orderSelectionQuestion = store.createRecord('order-selection-question', {
        order,
        selection: orderSelection,
      });
      store.createRecord('order-selection-question', {
        order,
        selection: orderSelection,
        text: 'foo',
      });
    });

    assert.strictEqual(order.get('lines.length'), 1, 'Order has 1 Order Line');
    assert.strictEqual(
      orderLine.get('selections.length'),
      1,
      'Order Line has 1 Order Selection',
    );
    assert.strictEqual(
      orderSelection.get('questions.length'),
      2,
      'Order Selection has 2 Order Selection Questions',
    );

    let done = assert.async();

    order
      .validate()
      .then(({ validations }) => {
        assert.false(
          validations.get('isValidating'),
          'All promises should be resolved',
        );
        assert.false(
          validations.get('isValid'),
          'Order should not be valid because of Order Selection Question',
        );
        return orderLine.validate();
      })
      .then(({ validations }) => {
        assert.false(
          validations.get('isValidating'),
          'All promises should be resolved',
        );
        assert.false(
          validations.get('isValid'),
          'Order Line should not be valid because of Order Selection Question',
        );
        return orderSelection.validate();
      })
      .then(({ validations }) => {
        assert.false(
          validations.get('isValidating'),
          'All promises should be resolved',
        );
        assert.false(
          validations.get('isValid'),
          'Order Selection should not be valid because of Order Selection Question',
        );
        return orderSelectionQuestion.validate();
      })
      .then(({ validations }) => {
        assert.false(
          validations.get('isValidating'),
          'All promises should be resolved',
        );
        assert.false(
          validations.get('isValid'),
          'Order Selection Question should not be valid',
        );
        done();
      });
  });

  test('order with valid question shows valid', function (assert) {
    assert.expect(11);
    let order = run(() =>
      this.owner
        .lookup('service:store')
        .createRecord('order', { source: 'external' }),
    );

    let orderLine, orderSelection, orderSelectionQuestion;

    let store = this.owner.lookup('service:store');
    run(() => {
      orderLine = store.createRecord('order-line', { order, type: 'item' });
      orderSelection = store.createRecord('order-selection', {
        order,
        line: orderLine,
        quantity: 1,
      });
      orderSelectionQuestion = store.createRecord('order-selection-question', {
        order,
        selection: orderSelection,
        text: 'answer',
      });
    });

    assert.strictEqual(order.get('lines.length'), 1, 'Order has 1 Order Line');
    assert.strictEqual(
      orderLine.get('selections.length'),
      1,
      'Order Line has 1 Order Selection',
    );
    assert.strictEqual(
      orderSelection.get('questions.length'),
      1,
      'Order Selection has 1 Order Selection Question',
    );

    let done = assert.async();

    order
      .validate()
      .then(({ validations }) => {
        assert.false(
          validations.get('isValidating'),
          'All promises should be resolved',
        );
        assert.true(
          validations.get('isValid'),
          'Order should be valid because of Order Selection Question',
        );
        return orderLine.validate();
      })
      .then(({ validations }) => {
        assert.false(
          validations.get('isValidating'),
          'All promises should be resolved',
        );
        assert.true(
          validations.get('isValid'),
          'Order Line should be valid because of Order Selection Question',
        );
        return orderSelection.validate();
      })
      .then(({ validations }) => {
        assert.false(
          validations.get('isValidating'),
          'All promises should be resolved',
        );
        assert.true(
          validations.get('isValid'),
          'Order Selection should be valid because of Order Selection Question',
        );
        return orderSelectionQuestion.validate();
      })
      .then(({ validations }) => {
        assert.false(
          validations.get('isValidating'),
          'All promises should be resolved',
        );
        assert.true(
          validations.get('isValid'),
          'Order Selection Question should be valid',
        );
        done();
      });
  });

  test('order with invalid question shows invalid if validated in reverse order', function (assert) {
    assert.expect(11);
    let order = run(() =>
      this.owner
        .lookup('service:store')
        .createRecord('order', { source: 'external' }),
    );

    let orderLine, orderSelection, orderSelectionQuestion;

    let store = this.owner.lookup('service:store');
    run(() => {
      orderLine = store.createRecord('order-line', { order, type: 'item' });
      orderSelection = store.createRecord('order-selection', {
        order,
        line: orderLine,
        quantity: 1,
      });
      orderSelectionQuestion = store.createRecord('order-selection-question', {
        order,
        selection: orderSelection,
      });
    });

    assert.strictEqual(order.get('lines.length'), 1, 'Order has 1 Order Line');
    assert.strictEqual(
      orderLine.get('selections.length'),
      1,
      'Order Line has 1 Order Selection',
    );
    assert.strictEqual(
      orderSelection.get('questions.length'),
      1,
      'Order Selection has 1 Order Selection Question',
    );

    let done = assert.async();

    orderSelectionQuestion
      .validate()
      .then(({ validations }) => {
        assert.false(
          validations.get('isValidating'),
          'All promises should be resolved',
        );
        assert.false(
          validations.get('isValid'),
          'Order Selection Question should not be valid',
        );
        return orderSelection.validate();
      })
      .then(({ validations }) => {
        assert.false(
          validations.get('isValidating'),
          'All promises should be resolved',
        );
        assert.false(
          validations.get('isValid'),
          'Order Selection should not be valid because of Order Selection Question',
        );
        return orderLine.validate();
      })
      .then(({ validations }) => {
        assert.false(
          validations.get('isValidating'),
          'All promises should be resolved',
        );
        assert.false(
          validations.get('isValid'),
          'Order Line should not be valid because of Order Selection Question',
        );
        return order.validate();
      })
      .then(({ validations }) => {
        assert.false(
          validations.get('isValidating'),
          'All promises should be resolved',
        );
        assert.false(
          validations.get('isValid'),
          'Order should not be valid because of Order Selection Question',
        );
        done();
      });
  });

  test('order with valid question shows valid if validated in reverse order', function (assert) {
    assert.expect(11);
    let order = run(() =>
      this.owner
        .lookup('service:store')
        .createRecord('order', { source: 'external' }),
    );

    let orderLine, orderSelection, orderSelectionQuestion;

    let store = this.owner.lookup('service:store');
    run(() => {
      orderLine = store.createRecord('order-line', { order, type: 'item' });
      orderSelection = store.createRecord('order-selection', {
        order,
        line: orderLine,
        quantity: 1,
      });
      orderSelectionQuestion = store.createRecord('order-selection-question', {
        order,
        selection: orderSelection,
        text: 'answer',
      });
    });

    assert.strictEqual(order.get('lines.length'), 1, 'Order has 1 Order Line');
    assert.strictEqual(
      orderLine.get('selections.length'),
      1,
      'Order Line has 1 Order Selection',
    );
    assert.strictEqual(
      orderSelection.get('questions.length'),
      1,
      'Order Selection has 1 Order Selection Question',
    );

    let done = assert.async();

    orderSelectionQuestion
      .validate()
      .then(({ validations }) => {
        assert.false(
          validations.get('isValidating'),
          'All promises should be resolved',
        );
        assert.true(
          validations.get('isValid'),
          'Order Selection Question should be valid',
        );
        return orderSelection.validate();
      })
      .then(({ validations }) => {
        assert.false(
          validations.get('isValidating'),
          'All promises should be resolved',
        );
        assert.true(
          validations.get('isValid'),
          'Order Selection should be valid because of Order Selection Question',
        );
        return orderLine.validate();
      })
      .then(({ validations }) => {
        assert.false(
          validations.get('isValidating'),
          'All promises should be resolved',
        );
        assert.true(
          validations.get('isValid'),
          'Order Line should be valid because of Order Selection Question',
        );
        return order.validate();
      })
      .then(({ validations }) => {
        assert.false(
          validations.get('isValidating'),
          'All promises should be resolved',
        );
        assert.true(
          validations.get('isValid'),
          'Order should be valid because of Order Selection Question',
        );
        done();
      });
  });

  test('order with invalid question shows valid if invalid question is deleted in reverse order', function (assert) {
    assert.expect(9);
    let done = assert.async();

    let order,
      orderLine,
      orderSelection,
      orderSelectionQuestion,
      orderSelectionQuestion2;

    let store = this.owner.lookup('service:store');
    run(() => {
      order = store.createRecord('order', { id: 1, source: 'external' });
      orderLine = store.createRecord('order-line', {
        id: 1,
        order,
        type: 'item',
      });
      orderSelection = store.createRecord('order-selection', {
        id: 1,
        order,
        line: orderLine,
        quantity: 1,
      });
      orderSelectionQuestion = store.createRecord('order-selection-question', {
        id: 1,
        order,
        selection: orderSelection,
        text: 'answer',
      });
      orderSelectionQuestion2 = store.createRecord('order-selection-question', {
        id: 2,
        order,
        selection: orderSelection,
      });

      // Not sure if this is needed.
      let fakeSave = function (model) {
        if (model.get('_internalModel')) {
          model.get('_internalModel').adapterWillCommit();
          model.get('_internalModel').adapterDidCommit();
        }
      };

      fakeSave(order);
      fakeSave(orderLine);
      fakeSave(orderSelection);
      fakeSave(orderSelectionQuestion);
      fakeSave(orderSelectionQuestion2);
    });

    assert.strictEqual(order.get('lines.length'), 1, 'Order has 1 Order Line');
    assert.strictEqual(
      orderLine.get('selections.length'),
      1,
      'Order Line has 1 Order Selection',
    );
    assert.strictEqual(
      orderSelection.get('questions.length'),
      2,
      'Order Selection has 2 Order Selection Question',
    );

    orderSelectionQuestion2
      .validate()
      .then(({ validations }) => {
        assert.false(
          validations.get('isValid'),
          'Order Selection Question 2 should be invalid',
        );

        return orderSelectionQuestion.validate();
      })
      .then(({ validations }) => {
        assert.true(
          validations.get('isValid'),
          'Order Selection Question should be valid',
        );

        return orderSelection.validate();
      })
      .then(({ validations }) => {
        assert.false(
          validations.get('isValid'),
          'Order Selection should be invalid because of Order Selection Question 2',
        );
        orderSelectionQuestion2.deleteRecord();

        return orderSelection.validate();
      })
      .then(({ validations }) => {
        assert.true(
          validations.get('isValid'),
          'Order Selection should be valid because invalid Order Selection Question 2 was marked deleted',
        );

        orderSelectionQuestion.deleteRecord();
        return orderSelection.validate();
      })
      .then(() => {
        assert.false(
          orderSelection.get('validations.attrs.questions.isValid'),
          'Order Selection should not be valid because all Order Selection Questions have been marked deleted',
        );

        order.deleteRecord();
        return orderSelection.validate();
      })
      .then(() => {
        assert.false(
          orderSelection.get('validations.attrs.order.isValid'),
          'Order Selection should not be valid because Order was marked for deletion',
        );

        done();
      });
  });
});
