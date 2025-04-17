import { not } from '@ember/object/computed';
import { computed } from '@ember/object';
import ResultCollection from './result-collection';
import cycleBreaker from '../utils/cycle-breaker';
import { flatten, uniq, compact } from '../utils/array';

export default ResultCollection.extend({
  isValid: computed(function () {
    return true;
  }).readOnly(),
  isTruelyValid: not('isValidating').readOnly(),

  messages: computed(function () {
    return [];
  }).readOnly(),
  errors: computed(function () {
    return [];
  }).readOnly(),

  warningMessages: computed(
    'content.@each.{messages,warningMessages}',
    cycleBreaker(function () {
      return uniq(
        compact(
          flatten([this.getEach('messages'), this.getEach('warningMessages')]),
        ),
      );
    }),
  ).readOnly(),

  warnings: computed(
    'attribute',
    'content.@each.{errors,warnings}',
    cycleBreaker(function () {
      return this._computeErrorCollection(
        flatten([this.getEach('errors'), this.getEach('warnings')]),
      );
    }),
  ).readOnly(),
});
