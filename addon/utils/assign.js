/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

/**
 * Assigns a value to an object via the given path while creating new objects if
 * the pathing requires it. If the given path is `foo.bar`, it will create a new object (obj.foo)
 * and assign value to obj.foo.bar. If the given object is an Ember.Object, it will create new Ember.Objects.
 */
import Ember from 'ember';

const {
  get,
  set,
  isNone,
  defineProperty
} = Ember;

export default function assign(obj, path, value, useEmberObject = false, delimiter = '.') {
  const keyPath = path.split(delimiter);
  const lastKeyIndex = keyPath.length - 1;
  let currObj = obj;

  // Iterate over each key in the path (minus the last one which is the property to be assigned)
  for (let i = 0; i < lastKeyIndex; ++i) {
    const key = keyPath[i];

    // Create a new object if it doesnt exist
    if (isNone(get(currObj, key))) {
      set(currObj, key, useEmberObject ? Ember.Object.create() : {});
    }
    currObj = get(currObj, key);
  }

  if (value instanceof Ember.ComputedProperty) {
    defineProperty(currObj, keyPath[lastKeyIndex], value);
  } else {
    set(currObj, keyPath[lastKeyIndex], value);
  }
}
