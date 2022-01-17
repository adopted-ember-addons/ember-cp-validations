import { A as emberArray } from '@ember/array';

const A = emberArray();

export function callable(method) {
  return function (collection) {
    return A[method].apply(collection, arguments);
  };
}

export const uniq = callable('uniq');
export const compact = callable('compact');
