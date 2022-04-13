import Controller from '@ember/controller';
import { action, set, setProperties } from '@ember/object';

export default class extends Controller {
  showAlert = false;
  isRegistered = false;
  showCode = false;
  didValidate = false;

  @action
  validate() {
    this.model.validate().then(({ validations }) => {
      set(this, 'didValidate', true);

      if (validations.get('isValid')) {
        setProperties(this, {
          showAlert: false,
          isRegistered: true,
          showCode: false,
        });
      } else {
        set(this, 'showAlert', true);
      }
    });
  }

  @action
  toggleProperty(p) {
    set(this, p, !this[p]);
  }

  @action
  resetModel() {
    this.send('reset');
  }
}
