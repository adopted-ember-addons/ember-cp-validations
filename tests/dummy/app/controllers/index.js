import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ApplicationController extends Controller {
  @tracked model;
  @tracked showAlert = false;
  @tracked isRegistered = false;
  @tracked showCode = false;
  @tracked didValidate = false;

  @action
  async validate() {
    const { validations } = await this.model.validate();
    this.didValidate = true;

    if (validations.isValid) {
      Object.assign(this, {
        showAlert: false,
        isRegistered: true,
        showCode: false
      });
    } else {
      this.showAlert = true;
    }
  }

  @action
  toggleProperty(p) {
    this[p] = !this[p];
  }

  @action
  reset() {
    this.send("reset");
  }
}
