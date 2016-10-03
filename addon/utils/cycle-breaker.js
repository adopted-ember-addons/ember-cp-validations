/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

/**
 * Use Ember Meta to break cycles in the CP chains. Lets say we have a User model with a `friends` property that is a hasMany
 * relationship. If we have a user John and he has a friend Jane, that creates a two-way relationship. John is Jane's friends and vise
 * versa. If we were to go down the CP chain and get validations for John's friends, it would go to Jane, then to Jane's friends, which
 * would point back to John. This method tracks which models have been already visited and breaks the cycle.
 */

import MetaData from './meta-data';

export default function cycleBreaker(fn, value) {
  let key = MetaData.symbol('cycle');

  return function() {
    if (MetaData.getData(this, key)) {
      return value;
    }
    MetaData.setData(this, key, true);
    try {
      return fn.apply(this, arguments);
    } finally {
      MetaData.setData(this, key, false);
    }
  };
}
