// BEGIN-SNIPPET validated-input
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { isEmpty } from '@ember/utils';

export default class ValidatedInput extends Component {
  @tracked showValidations = false;

  get hasContent() {
    return !isEmpty(this.args.value);
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
    return this.shouldDisplayValidations && !isEmpty(this.validation.warnings) && this.isValid;
  }

  get validation() {
    return this.args.model.get("validations.attrs")[this.args.valuePath];
  }

  @action
  onFocusOut() {
    this.showValidations = true;
  }

  @action
  onInput({ target }) {
    this.args.onInput(target?.value);
  }
}
// END-SNIPPET
