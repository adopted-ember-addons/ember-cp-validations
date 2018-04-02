import EmberObject, { computed, set, get } from '@ember/object';
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

    if (this.get('isAsync')) {
      this._handlePromise();
    }
  },

  isWarning: readOnly('_validator.isWarning'),
  isInvalid: not('isValid'),
  isNotValidating: not('isValidating'),
  isTruelyValid: and('isNotValidating', 'isValid'),
  isTruelyInvalid: and('isNotValidating', 'isInvalid'),

  isAsync: computed('_promise', function() {
    return isPromise(get(this, '_promise'));
  }),

  messages: computed('message', function() {
    return makeArray(get(this, 'message'));
  }),

  error: computed('isInvalid', 'type', 'message', 'attribute', function() {
    if (get(this, 'isInvalid')) {
      return ValidationError.create({
        type: get(this, '_type'),
        message: get(this, 'message'),
        attribute: get(this, 'attribute')
      });
    }

    return null;
  }),

  errors: computed('error', function() {
    return makeArray(get(this, 'error'));
  }),

  warningMessages: computed('warningMessage', function() {
    return makeArray(get(this, 'warningMessage'));
  }),

  warning: computed(
    'isWarning',
    'type',
    'warningMessage',
    'attribute',
    function() {
      if (get(this, 'isWarning') && !isNone(get(this, 'warningMessage'))) {
        return ValidationError.create({
          type: get(this, '_type'),
          message: get(this, 'warningMessage'),
          attribute: get(this, 'attribute')
        });
      }

      return null;
    }
  ),

  warnings: computed('warning', function() {
    return makeArray(get(this, 'warning'));
  }),

  _handlePromise() {
    set(this, 'isValidating', true);

    get(this, '_promise').finally(() => {
      set(this, 'isValidating', false);
    });
  }
});
