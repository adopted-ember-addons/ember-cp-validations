import Ember from 'ember';

const {
  A: emberArray
} = Ember;

const A = emberArray();

export function callable(method) {
  return function(collection) {
    return A[method].apply(collection, arguments);
  };
}

export const uniq = callable('uniq');
export const compact = callable('compact');

export function flatten(array = []) {
  let result = [];

  for (let i = 0, l = array.length; i < l; i++) {
    let item = array[i];

    if (Array.isArray(item)) {
      result = result.concat(flatten(item));
    } else {
      result.push(item);
    }
  }

  return result;
}
