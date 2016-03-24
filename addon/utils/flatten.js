/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

export default function flatten(array = []) {
  let result = [];

  for (let i = 0, l = array.length; i < l; i++) {
    const item = array[i];

    if (Array.isArray(item)) {
      result = result.concat(flatten(item));
    } else {
      result.push(item);
    }
  }

  return result;
}
