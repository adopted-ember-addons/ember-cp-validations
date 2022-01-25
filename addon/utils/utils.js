import { assign } from '@ember/polyfills';
import { isHTMLSafe } from '@ember/template';
import { typeOf } from '@ember/utils';
import { A as emberArray, isArray } from '@ember/array';
// eslint-disable-next-line ember/use-ember-data-rfc-395-imports
import DS from 'ember-data';
import Model from '@ember-data/model';

export function unwrapString(s) {
  if (isHTMLSafe(s)) {
    return s.toString();
  }

  return s;
}

function isDsModel(o) {
  return !!(o && o instanceof Model);
}

function isDSManyArray(o) {
  return !!(o && isArray(o) && o instanceof DS.ManyArray);
}

function isObject(o) {
  return typeOf(o) === 'object' || typeOf(o) === 'instance';
}

export function isValidatable(value) {
  return isDsModel(value) ? !value.isDeleted : true;
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
