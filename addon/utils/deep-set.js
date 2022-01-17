/**
 * Assigns a value to an object via the given path while creating new objects if
 * the pathing requires it. If the given path is `foo.bar`, it will create a new object (obj.foo)
 * and assign value to obj.foo.bar. If the given object is an Ember.Object, it will create new Ember.Objects.
 */
import { isDescriptor } from './utils';
import { isNone } from '@ember/utils';
import { defineProperty, set, get } from '@ember/object';

export default function deepSet(obj, path, value) {
  let keyPath = path.split('.');
  let lastKeyIndex = keyPath.length - 1;
  let currObj = obj;

  // Iterate over each key in the path (minus the last one which is the property to be assigned)
  for (let i = 0; i < lastKeyIndex; ++i) {
    let key = keyPath[i];

    // Create a new object if it doesnt exist
    if (isNone(get(currObj, key))) {
      set(currObj, key, {});
    }
    currObj = get(currObj, key);
  }

  if (isDescriptor(value)) {
    defineProperty(currObj, keyPath[lastKeyIndex], value);
  } else {
    set(currObj, keyPath[lastKeyIndex], value);
  }
}
