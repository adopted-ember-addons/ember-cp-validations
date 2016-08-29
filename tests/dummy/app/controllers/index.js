/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';

export default Ember.Controller.extend({
  showAlert: false,
  isRegistered: false,
  showCode: false,
  didValidate: false,

  actions: {
    validate() {
      this.get('model').validate().then(({ validations }) => {
        this.set('didValidate', true);

        if(validations.get('isValid')) {
          this.setProperties({
            showAlert: false,
            isRegistered: true,
            showCode: false
          });
        } else {
          this.set('showAlert', true);
        }
      });
    }
  }
});
