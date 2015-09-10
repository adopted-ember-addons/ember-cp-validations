import Ember from "ember";
import {
  module, test
}
from 'qunit';
import startApp from '../helpers/start-app';
var App;

var validInputValues = {
  username: "offirgolan",
  password: "Pass123",
  email: "offirgolan@gmail.com",
  emailConfirmation: "offirgolan@gmail.com",
  firstName: "Offir",
  lastName: "Golan",
  dob: "1/1/1930"
};

module('Acceptance | Dummy | index', {
  beforeEach: function() {
    App = startApp();
  },
  afterEach: function() {
    Ember.run(App, App.destroy);
  }
});

test("Page Loads", function(assert) {
  assert.expect(2);
  visit('/');
  andThen(function() {
    assert.equal(find('.demo .info h1').text(), "CP Validations");
    assert.equal(find('.demo .form .register h2').text(), "Create an Account");
  });
});

test("Helper tooltips", function(assert) {
  assert.expect(2);
  visit('/');
  andThen(function() {
    assert.equal(find('.section .section-info').length, 3);
    assert.equal(find('.section .section-info:first').text().trim().length > 0, true);
  });
});

test("Valid form submit", function(assert) {
  visit('/');
  andThen(function() {
    Object.keys(validInputValues).forEach((input) => {
      let $input = find(`.demo .validated-input input[name="${input}"]`);
      assert.ok($input, `${input} found`);
      fillIn($input, validInputValues[input]);
      assert.ok($input.parent('.validated-input.has-success'), `${input} success`);
    });
    click('#signup');
  });

  andThen(function() {
    assert.ok(find('.form .registered img.tomster'));
    assert.equal(find('.form .registered h2.success').text(), 'Success');
  });
});

test("Invalid to valid email", function(assert) {
  assert.expect(4);
  visit('/');
  var $input;
  andThen(function() {
    $input = find('.demo .validated-input input[name="email"]');
    assert.ok($input);
    fillIn($input, 'invalid-email');
  });

  andThen(function() {
    assert.equal($input.parent('.form-group').find('.input-error .error').text().trim(), 'This field must be a valid email address');
    assert.ok($input.parent('.validated-input.has-error'));

    fillIn($input, validInputValues['email']);
    assert.ok($input.parent('.validated-input.has-success'));
  });
});

