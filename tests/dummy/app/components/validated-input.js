// BEGIN-SNIPPET validated-input
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { isEmpty } from '@ember/utils';

export default class ValidatedInput extends Component {
  @tracked showValidations = false;

  get hasContent() {
    return !isEmpty(this.value);
  }

  get isValid() {
    return this.hasContent && this.validation.isTruelyValid;
  }

  get shouldDisplayValidations() {
    return this.showValidations || this.args.didValidate || this.hasContent;
  }

  get showErrorClass() {
    return !this.validation.isValidating && this.showErrorMessage && this.validation;
  }

  get showErrorMessage() {
    return this.shouldDisplayValidations && this.validation.isInvalid;
  }

  get showWarningMessage() {
    this.shouldDisplayValidations && !isEmpty(this.validation.warnings) && this.isValid;
  }

  get validation() {
    return this.args.model.validations.attrs[this.args.valuePath];
  }

  get value() {
    return this.args.model[this.args.valuePath];
  }

  set value(value) {
    return this.args.model[this.args.valuePath] = value;
  }

  @action
  onFocusOut() {
    this.showValidations = true;
  }
}
// END-SNIPPET
