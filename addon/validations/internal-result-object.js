/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import ValidationError from './error';
import { requireModule, isPromise } from '../utils/utils';

const DS = requireModule('ember-data');

const {
  get,
  set,
  isNone,
  computed,
  canInvoke,
  makeArray,
} = Ember;

const {
  and,
  not
} = computed;

export default Ember.Object.extend({
  model: null,
  isValid: true,
  isValidating: false,
  message: null,
  attribute: '',

  attrValue: null,
  _promise: null,
  _validator: null,
  _promiseResolved: false,

  init() {
    this._super(...arguments);
    this._handlePromise();
  },

  isNotValidating: not('isValidating'),
  isInvalid: not('isValid'),
  isTruelyValid: and('isNotValidating', 'isValid'),

  isAsync: computed('_promise', '_promiseResolved', function () {
    return isPromise(get(this, '_promise')) && !get(this, '_promiseResolved');
  }),

  isDirty: computed('attrValue', function () {
    const model = get(this, 'model');
    const attribute = get(this, 'attribute');
    const attrValue = get(this, 'attrValue');

    // Check default model values
    if (DS && model instanceof DS.Model && canInvoke(model, 'eachAttribute')) {
      const attrMeta = model.get('constructor.attributes').get(attribute);

      if (attrMeta) {
        const defaultValue = attrMeta.options.defaultValue;

        if (!isNone(defaultValue)) {
          return defaultValue !== attrValue;
        }
      }
    }
    return !isNone(attrValue);
  }),

  messages: computed('message', function () {
    return makeArray(get(this, 'message'));
  }),

  error: computed('message', 'isInvalid', 'attribute', function () {
    if (get(this, 'isInvalid')) {
      return ValidationError.create({
        message: get(this, 'message'),
        attribute: get(this, 'attribute')
      });
    }

    return null;
  }),

  errors: computed('error', function () {
    return makeArray(get(this, 'error'));
  }),

  _handlePromise() {
    const promise = get(this, '_promise');

    if(isPromise(promise)) {
      promise.finally(() => set(this, '_promiseResolved', true));
    }
  }
});
