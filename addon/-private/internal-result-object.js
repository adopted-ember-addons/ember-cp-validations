import { isNone } from '@ember/utils';
import { makeArray } from '@ember/array';
import ValidationError from '../validations/error';
import { tracked } from '@glimmer/tracking';

export default class InternalResultObject {
  @tracked model;
  @tracked isValid = true;
  @tracked message;
  @tracked warningMessage;
  @tracked attribute = '';
  @tracked _validator;

  static create(props) {
    return new InternalResultObject(props);
  }

  constructor(props) {
    Object.assign(this, props);
  }

  get _type() {
    return this._validator._type;
  }

  get isWarning() {
    return this._validator.isWarning;
  }

  get isInvalid() {
    return !this.isValid;
  }

  get messages() {
    return makeArray(this.message);
  }

  get error() {
    if (this.isInvalid) {
      return ValidationError.create({
        type: this._type,
        message: this.message,
        attribute: this.attribute,
      });
    }

    return null;
  }

  get errors() {
    return makeArray(this.error);
  }

  get warningMessages() {
    return makeArray(this.warningMessage);
  }

  get warning() {
    if (this.isWarning && !isNone(this.warningMessage)) {
      return ValidationError.create({
        type: this._type,
        message: this.warningMessage,
        attribute: this.attribute,
      });
    }

    return null;
  }

  get warnings() {
    return makeArray(this.warning);
  }
}
