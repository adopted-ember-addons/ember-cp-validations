import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class extends Controller {
  queryParams = ['file'];
  @tracked file = 'user-model.js';

  @tracked showAlert = false;
  @tracked isRegistered = false;
  @tracked showCode = false;
  @tracked didValidate = false;

  @action
  validate() {
    this.model.validate().then(({ validations }) => {
      this.didValidate = true;

      if (validations.get('isValid')) {
        this.showAlert = false;
        this.isRegistered = true;
        this.showCode = false;
      } else {
        this.showAlert = true;
      }
    });
  }

  @action
  toggleProperty(p) {
    this[p] = !this[p];
  }
}
