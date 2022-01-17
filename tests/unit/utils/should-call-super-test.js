import { module, test } from 'qunit';
import shouldCallSuper from 'ember-cp-validations/utils/should-call-super';

module('Unit | Utils | shouldCallSuper', function () {
  test('shouldCallSuper - true', function (assert) {
    assert.expect(1);
    class Parent {
      get foo() {
        return null;
      }
    }

    class Child extends Parent {
      get foo() {
        assert.ok(shouldCallSuper(this, 'foo'));
        return null;
      }
    }

    let child = new Child();
    child.foo;
  });

  test('shouldCallSuper - false', function (assert) {
    assert.expect(1);
    class Parent {}

    class Child extends Parent {
      get foo() {
        assert.notOk(shouldCallSuper(this, 'foo'));
        return null;
      }
    }

    let child = new Child();
    child.foo;
  });
});
