import Component from '@ember/component';
import { and } from '@ember/object/computed';

export default Component.extend({
  init() {
    this._super(...arguments);
    // If called first this is fine
    // this.model.validations.isValid;
    this.myProp;
  },
  myProp: and('cheese', 'model.validations.isValid')
});
