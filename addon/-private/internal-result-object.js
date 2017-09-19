/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import ValidationError from '../validations/error';
import { isDsModel, isPromise } from '../utils/utils';

const {
  get,
  set,
  isNone,
  computed,
  canInvoke,
  makeArray,
  defineProperty
} = Ember;

const {
  and,
  not,
  readOnly
} = computed;

export default Ember.Object.extend({
  model: null,
  isValid: true,
  isValidating: false,
  message: null,
  warningMessage: null,
  attribute: '',

  attrValue: null,
  _promise: null,
  _validator: null,
  _type: readOnly('_validator._type'),

  init() {
    this._super(...arguments);

    defineProperty(this, 'attrValue', computed.readOnly(`model.${get(this, 'attribute')}`));

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

  isDirty: computed('attrValue', function() {
    let model = get(this, 'model');
    let attribute = get(this, 'attribute');
    let attrValue = get(this, 'attrValue');

    // Check default model values
    if (isDsModel(model) && canInvoke(model, 'eachAttribute')) {
      let attrMeta = model.get('constructor.attributes').get(attribute);

      if (attrMeta) {
        let { defaultValue } = attrMeta.options;

        if (!isNone(defaultValue)) {
          return defaultValue !== attrValue;
        }
      }
    }
    return !isNone(attrValue);
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

  warning: computed('isWarning', 'type', 'warningMessage', 'attribute', function() {
    if (get(this, 'isWarning') && !isNone(get(this, 'warningMessage'))) {
      return ValidationError.create({
        type: get(this, '_type'),
        message: get(this, 'warningMessage'),
        attribute: get(this, 'attribute')
      });
    }

    return null;
  }),

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
