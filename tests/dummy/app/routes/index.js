import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service store;

  model() {
    return this.store.createRecord('user', {
      details: this.store.createRecord('user-detail'),
    });
  }

  setupController(controller, model) {
    Object.assign(controller, {
      showAlert: false,
      isRegistered: false,
      showCode: false,
      didValidate: false,
      model,
    });
  }

  @action
  reset() {
    this.refresh();
  }
}
