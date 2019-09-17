import Component from '@ember/component';
import { and } from '@ember/object/computed';

export default Component.extend({
  myProp: and('cheese', 'model.validations.isValid'),
  // Using this computed ordering solves the issue
  // myProp: and('model.validations.isValid', 'cheese')
});
