import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import '../../helpers/ensure-get-registered';

moduleForComponent('helper:v-get', 'Integration | Helper | v-get', {
  integration: true,
  beforeEach() {
    var model = Ember.Object.create({
      validations: {
        isValid: false,
        attrs: {
          username: {
            isValid: false,
            message: 'This field is invalid'
          },
          email: {
            isValid: true
          }
        }
      }
    });
    this.set('model', model);
  }
});


test('it renders', function(assert) {
  assert.expect(1);

  this.render(hbs`{{v-get model 'isValid'}}`);
  assert.equal(this.$().text().trim(), 'false');
});

test('access attribute validations', function(assert) {
  assert.expect(3);
  this.render(hbs`{{v-get model 'username' 'isValid'}}`);
  assert.equal(this.$().text().trim(), 'false');

  this.render(hbs`{{v-get model 'username' 'message'}}`);
  assert.equal(this.$().text().trim(), 'This field is invalid');

  this.render(hbs`{{v-get model 'email' 'isValid'}}`);
  assert.equal(this.$().text().trim(), 'true');

});


test('updating validation should rerender', function(assert) {
  assert.expect(2);

  this.render(hbs`{{v-get model 'username' 'isValid'}}`);
  assert.equal(this.$().text().trim(), 'false');

  this.set('model.validations.attrs.username.isValid', true);

  assert.equal(this.$().text().trim(), 'true');

});

test('block statement param', function(assert) {
  assert.expect(2);

  this.render(hbs`
    {{#if (v-get model 'email' 'isValid')}}
      Email address is valid
    {{/if}}
  `);

  assert.equal(this.$().text().trim(), 'Email address is valid');

  this.render(hbs`
    {{#unless (v-get model 'username' 'isValid')}}
      {{v-get model 'username' 'message'}}
    {{/unless}}
  `);

  assert.equal(this.$().text().trim(), 'This field is invalid');
});
