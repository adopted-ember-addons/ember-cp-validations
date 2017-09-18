/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import ResultCollection from './result-collection';
import cycleBreaker from '../utils/cycle-breaker';
import { flatten, uniq, compact } from '../utils/array';

const {
  computed,
} = Ember;

export default ResultCollection.extend({
  isValid: computed(() => true).readOnly(),
  isTruelyValid: computed.not('isValidating').readOnly(),

  messages: computed(() => []).readOnly(),
  errors: computed(() => []).readOnly(),

  warningMessages: computed('content.@each.{messages,warningMessages}', cycleBreaker(function() {
    return uniq(compact(flatten([this.getEach('messages'), this.getEach('warningMessages')])));
  })).readOnly(),

  warnings: computed('attribute', 'content.@each.{errors,warnings}', cycleBreaker(function() {
    return this._computeErrorCollection(flatten([this.getEach('errors'), this.getEach('warnings')]));
  })).readOnly()
});
