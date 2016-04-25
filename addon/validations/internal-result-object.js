/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import ValidationError from './error';
import { hasEmberData } from '../utils/utils';

const {
  get,
  isNone,
  computed,
  canInvoke,
  makeArray,
  defineProperty
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

  init() {
    this._super(...arguments);
    // TODO: Not good practice. Stef will make this go away.
    defineProperty(this, 'attrValue', computed.oneWay(`model.${get(this, 'attribute')}`));
  },

  isNotValidating: not('isValidating'),
  isInvalid: not('isValid'),
  isTruelyValid: and('isNotValidating', 'isValid'),

  isAsync: computed('_promise', function () {
    const promise = get(this, '_promise');

    return !isNone(promise) && canInvoke(promise, 'then');
  }),

  isDirty: computed('attrValue', function () {
    const model = get(this, 'model');
    const attribute = get(this, 'attribute');
    const attrValue = get(this, 'attrValue');

    // Check default model values
    if (hasEmberData() && model instanceof self.DS.Model && canInvoke(model, 'eachAttribute')) {
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
  })
});
