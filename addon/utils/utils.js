import ArrayProxy from '@ember/array/proxy';
import ObjectProxy from '@ember/object/proxy';
import { assign } from '@ember/polyfills';
import { isHTMLSafe } from '@ember/string';
import EmberObject, { get } from '@ember/object';
import { typeOf } from '@ember/utils';
import { A as emberArray, isArray } from '@ember/array';

import Ember from 'ember';
import requireModule from 'ember-require-module';

const DS = requireModule('ember-data');

const { canInvoke } = Ember;

export { getDependentKeys, isDescriptor } from '../-private/ember-internals';

export function unwrapString(s) {
  if (isHTMLSafe(s)) {
    return s.toString();
  }

  return s;
}

export function unwrapProxy(o) {
  return isProxy(o) ? unwrapProxy(get(o, 'content')) : o;
}

export function isProxy(o) {
  return !!(o && (o instanceof ObjectProxy || o instanceof ArrayProxy));
}

export function isPromise(p) {
  return !!(p && canInvoke(p, 'then'));
}

export function isDsModel(o) {
  return !!(DS && o && o instanceof DS.Model);
}

export function isDSManyArray(o) {
  return !!(
    DS &&
    o &&
    isArray(o) &&
    (o instanceof DS.PromiseManyArray || o instanceof DS.ManyArray)
  );
}

export function isEmberObject(o) {
  return !!(o && o instanceof EmberObject);
}

export function isObject(o) {
  return typeOf(o) === 'object' || typeOf(o) === 'instance';
}

export function isValidatable(value) {
  let v = unwrapProxy(value);
  return isDsModel(v) ? !get(v, 'isDeleted') : true;
}

export function getValidatableValue(value) {
  if (!value) {
    return value;
  }

  if (isDSManyArray(value)) {
    return emberArray(value.filter(v => isValidatable(v)));
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
