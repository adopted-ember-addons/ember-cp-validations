/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import flatten from '../utils/flatten';
import cycleBreaker from '../utils/cycle-breaker';

const {
  get,
  set,
  RSVP,
  computed,
  isEmpty,
  makeArray,
  A: emberArray
} = Ember;

const A = emberArray();

function callable(method) {
  return function(collection) {
    return A[method].apply(collection, arguments);
  };
}

const uniq = callable('uniq');
const compact = callable('compact');

export default Ember.Object.extend({
  content: null,
  attribute: '',

  init() {
    this._super(...arguments);
    set(this, 'content', emberArray(get(this, 'content')));
  },

  isInvalid: computed.not('isValid'),

  isValid: computed('content.@each.isValid', cycleBreaker(function() {
    return get(this, 'content').isEvery('isValid', true);
  }, true)),

  isValidating: computed('content.@each.isValidating', cycleBreaker(function() {
    return !get(this, 'content').isEvery('isValidating', false);
  }, false)),

  isTruelyValid: computed('content.@each.isTruelyValid', cycleBreaker(function() {
    return get(this, 'content').isEvery('isTruelyValid', true);
  }, true)),

  isDirty: computed('content.@each.isDirty', cycleBreaker(function() {
    return !get(this, 'content').isEvery('isDirty', false);
  }, false)),

  isAsync: computed('content.@each.isAsync', cycleBreaker(function() {
    return !get(this, 'content').isEvery('isAsync', false);
  }, false)),

  messages: computed('content.@each.messages.[]', cycleBreaker(function() {
    let messages = flatten(get(this, 'content').getEach('messages'));
    return uniq(compact(messages));
  })),

  message: computed('messages.[]', cycleBreaker(function() {
    return get(this, 'messages.0');
  })),

  errors: computed('content.@each.errors.[]', cycleBreaker(function() {
    let errors = flatten(get(this, 'content').getEach('errors'));
    return uniq(compact(errors));
  })),

  error: computed('errors.[]', cycleBreaker(function() {
    return get(this, 'errors.0');
  })),

  _promise: computed('content.@each._promise', cycleBreaker(function() {
    var promises = get(this, 'content').getEach('_promise');
    if (!isEmpty(promises)) {
      return RSVP.all(compact(flatten(promises)));
    }
  })),

  value: computed('isAsync', cycleBreaker(function() {
    var isAsync = get(this, 'isAsync');
    var promise = get(this, '_promise');
    return isAsync ? promise : this;
  })),

  /**
   * Clear all errors in this result collection
   * A single type or multiple validator types can be specified. (i.e. clearErrors('presence') or clearErrors(['presence', 'length']))
   * @param  {String/Array} types
   * @return
   */
  clearErrors(types) {
    let content = get(this, 'content');
    types = makeArray(types);

    if (!isEmpty(types)) {
      content = content.filter(result => types.indexOf(get(result, '_type')) !== -1);
    }

    content.forEach(result => {
      result.update({
        message: null,
        isValid: true
      });
    });
  }
});
