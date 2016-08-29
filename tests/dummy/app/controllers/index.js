/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import { task } from 'ember-concurrency';

export default Ember.Controller.extend({
  showAlert: false,
  isRegistered: false,
  showCode: false,
  didValidate: false,

  validate: task(function * () {
    const { validations } = yield this.get('model').validate();

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
  }).restartable()
});
