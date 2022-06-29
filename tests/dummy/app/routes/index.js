import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class extends Route {
  @service store;

  model() {
    return this.store.createRecord('user', {
      details: this.store.createRecord('user-detail'),
    });
  }
}
