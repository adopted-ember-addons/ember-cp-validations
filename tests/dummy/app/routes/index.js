import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  store: service(),

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
