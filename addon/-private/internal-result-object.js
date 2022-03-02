import { isNone } from '@ember/utils';
import { makeArray } from '@ember/array';
import ValidationError from '../validations/error';
import { tracked } from '@glimmer/tracking';
import { dependentKeyCompat } from '@ember/object/compat';

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

  @dependentKeyCompat
  get _type() {
    return this._validator._type;
  }

  @dependentKeyCompat
  get isWarning() {
    return this._validator.isWarning;
  }

  @dependentKeyCompat
  get isInvalid() {
    return !this.isValid;
  }

  @dependentKeyCompat
  get messages() {
    return makeArray(this.message);
  }

  @dependentKeyCompat
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

  @dependentKeyCompat
  get errors() {
    return makeArray(this.error);
  }

  @dependentKeyCompat
  get warningMessages() {
    return makeArray(this.warningMessage);
  }

  @dependentKeyCompat
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

  @dependentKeyCompat
  get warnings() {
    return makeArray(this.warning);
  }
}
