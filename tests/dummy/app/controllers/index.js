/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';

export default Ember.Controller.extend({
  showAlert: false,
  isRegistered: false,
  showCode: false,
  didValidate: false,

  actions: {
    showCode() {
        this.toggleProperty('showCode');
      },

      submit() {
        var model = this.get('model');
        model.validate().then(({
          model, validations
        }) => {
          if (validations.get('isValid')) {
            this.setProperties({
              showAlert: false,
              isRegistered: true,
              showCode: false
            });
          } else {
            this.set('showAlert', true);
          }
          this.set('didValidate', true);
        }, (errors) => {

        });
      },

      dismissAlert() {
        this.set('showAlert', false);
      }
  }
});
