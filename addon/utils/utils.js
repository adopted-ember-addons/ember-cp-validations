import ArrayProxy from '@ember/array/proxy';
import ObjectProxy from '@ember/object/proxy';
import { assign } from '@ember/polyfills';
import { isHTMLSafe } from '@ember/template';
import { typeOf } from '@ember/utils';
import { A as emberArray, isArray } from '@ember/array';
import Ember from 'ember';
import DS, { PromiseManyArray } from 'ember-data';
import Model from '@ember-data/model';

const { canInvoke } = Ember;

export { getDependentKeys, isDescriptor } from '../-private/ember-internals';

export function unwrapString(s) {
  if (isHTMLSafe(s)) {
    return s.toString();
  }

  return s;
}

export function unwrapProxy(o) {
  return isProxy(o) ? unwrapProxy(o.content) : o;
}

export function isProxy(o) {
  return !!(o && (o instanceof ObjectProxy || o instanceof ArrayProxy));
}

export function isPromise(p) {
  return !!(p && canInvoke(p, 'then'));
}

export function isDsModel(o) {
  return !!(o && o instanceof Model);
}

export function isDSManyArray(o) {
  return !!(
    o &&
    isArray(o) &&
    (o instanceof PromiseManyArray || o instanceof DS.ManyArray)
  );
}

export function isObject(o) {
  return typeOf(o) === 'object' || typeOf(o) === 'instance';
}

export function isValidatable(value) {
  let v = unwrapProxy(value);
  return isDsModel(v) ? !v.isDeleted : true;
}

export function getValidatableValue(value) {
  if (!value) {
    return value;
  }

  if (isDSManyArray(value)) {
    return emberArray(value.filter((v) => isValidatable(v)));
  }

  return isValidatable(value) ? value : undefined;
}

export function mergeOptions(...options) {
  let o = {};

  for (let i = options.length - 1; i >= 0; i--) {
    let _o = options[i];
    assign(o, isObject(_o) ? _o : {});
  }

  return o;
}
