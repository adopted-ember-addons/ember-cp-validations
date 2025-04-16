import EmberObject, { computed, set } from '@ember/object';
import { and, not, readOnly } from '@ember/object/computed';
import { isNone } from '@ember/utils';
import { makeArray } from '@ember/array';
import ValidationError from '../validations/error';
import { isPromise } from '../utils/utils';

export default EmberObject.extend({
  model: null,
  isValid: true,
  isValidating: false,
  message: null,
  warningMessage: null,
  attribute: '',

  _promise: null,
  _validator: null,
  _type: readOnly('_validator._type'),

  init() {
    this._super(...arguments);

    if (this.isAsync) {
      this._handlePromise();
    }
  },

  isWarning: readOnly('_validator.isWarning'),
  isInvalid: not('isValid'),
  isNotValidating: not('isValidating'),
  isTruelyValid: and('isNotValidating', 'isValid'),
  isTruelyInvalid: and('isNotValidating', 'isInvalid'),

  isAsync: computed('_promise', function () {
    return isPromise(this._promise);
  }),

  messages: computed('message', function () {
    return makeArray(this.message);
  }),

  error: computed(
    '_type',
    'attribute',
    'isInvalid',
    'message',
    'type',
    function () {
      if (this.isInvalid) {
        return ValidationError.create({
          type: this._type,
          message: this.message,
          attribute: this.attribute,
        });
      }

      return null;
    },
  ),

  errors: computed('error', function () {
    return makeArray(this.error);
  }),

  warningMessages: computed('warningMessage', function () {
    return makeArray(this.warningMessage);
  }),

  warning: computed(
    '_type',
    'attribute',
    'isWarning',
    'type',
    'warningMessage',
    function () {
      if (this.isWarning && !isNone(this.warningMessage)) {
        return ValidationError.create({
          type: this._type,
          message: this.warningMessage,
          attribute: this.attribute,
        });
      }

      return null;
    },
  ),

  warnings: computed('warning', function () {
    return makeArray(this.warning);
  }),

  _handlePromise() {
    set(this, 'isValidating', true);

    this._promise.finally(() => {
      set(this, 'isValidating', false);
    });
  },
});
