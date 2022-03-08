import { A as emberArray, isArray } from '@ember/array';
// eslint-disable-next-line ember/use-ember-data-rfc-395-imports
import DS from 'ember-data';
import Model from '@ember-data/model';

export function isValidatable(value) {
  return value && value instanceof Model ? !value.isDeleted : true;
}

export function getValidatableValue(value) {
  if (!value) {
    return value;
  }

  if (value && isArray(value) && value instanceof DS.ManyArray) {
    return emberArray(value.filter((v) => isValidatable(v)));
  }

  return isValidatable(value) ? value : undefined;
}
