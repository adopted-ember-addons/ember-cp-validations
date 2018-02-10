/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return this.store.createRecord('user', {
      details: this.store.createRecord('user-detail')
    });
  },

  setupController(controller) {
    controller.setProperties({
      showAlert: false,
      isRegistered: false,
      showCode: false,
      didValidate: false
    });

    this._super(...arguments);
  },

  actions: {
    reset() {
      this.refresh();
    }
  }
});
