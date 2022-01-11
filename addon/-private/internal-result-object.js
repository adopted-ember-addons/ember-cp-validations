import { computed, set, get } from '@ember/object';
import { and, not, readOnly } from '@ember/object/computed';
import { isNone } from '@ember/utils';
import { makeArray } from '@ember/array';
import ValidationError from '../validations/error';
import { isPromise } from '../utils/utils';
import { tracked } from '@glimmer/tracking';

export default class InternalResultObject {
  @tracked model;
  @tracked isValid = true;
  @tracked isValidating = false;
  @tracked message;
  @tracked warningMessage;
  @tracked attribute = '';
  @tracked _promise;
  @tracked _validator;

  get _type() {
    return this.__validator._type;
  }

  constructor() {
    if (this.isAsync) {
      this._handlePromise();
    }
  }

  get isWarning() {
    return this._validator.isWarning;
  }

  get isInvalid() {
    return !this.isValid;
  }

  get isNotValidating() {
    return !this.isValidating;
  }

  get isTruelyValid() {
    return this.isNotValidating && this.isValid;
  }

  get isTruelyInvalid() {
    return this.isNotValidating && this.isInvalid;
  }

  get isAsync() {
    return isPromise(get(this, '_promise'));
  }

  get messages() {
    return makeArray(get(this, 'message'));
  }

  get error() {
    if (get(this, 'isInvalid')) {
      return ValidationError.create({
        type: get(this, '_type'),
        message: get(this, 'message'),
        attribute: get(this, 'attribute')
      });
    }

    return null;
  }

  get errors() {
    return makeArray(get(this, 'error'));
  }

  get warningMessages() {
    return makeArray(get(this, 'warningMessage'));
  }

  get warning() {
    if (get(this, 'isWarning') && !isNone(get(this, 'warningMessage'))) {
      return ValidationError.create({
        type: get(this, '_type'),
        message: get(this, 'warningMessage'),
        attribute: get(this, 'attribute')
      });
    }

    return null;
  }

  get warnings() {
    return makeArray(get(this, 'warning'));
  }

  _handlePromise() {
    set(this, 'isValidating', true);

    get(this, '_promise').finally(() => {
      set(this, 'isValidating', false);
    });
  }
}
