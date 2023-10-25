import ArrayProxy from '@ember/array/proxy';
import ObjectProxy from '@ember/object/proxy';
import { isHTMLSafe } from '@ember/template';
import EmberObject from '@ember/object';
import { typeOf } from '@ember/utils';
import { A as emberArray } from '@ember/array';
import require from 'require';

function requireModule(module, exportName = 'default') {
  if (require.has(module)) {
    return require(module)[exportName];
  }
}

const DS = requireModule('ember-data');
const Model = requireModule('@ember-data/model');

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

function canInvoke(obj, methodName) {
  return (
    obj !== null && obj !== undefined && typeof obj[methodName] === 'function'
  );
}

export function isPromise(p) {
  return !!(p && canInvoke(p, 'then'));
}

export function isDsModel(o) {
  return !!(Model && o && o instanceof Model);
}

export function isDSManyArray(o) {
  return !!(
    DS &&
    o &&
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
    Object.assign(o, isObject(_o) ? _o : {});
  }

  return o;
}
