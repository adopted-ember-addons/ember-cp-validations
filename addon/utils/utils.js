import { A as emberArray, isArray } from '@ember/array';
// eslint-disable-next-line ember/use-ember-data-rfc-395-imports
import DS from 'ember-data';
import Model from '@ember-data/model';

function isDsModel(o) {
  return !!(o && o instanceof Model);
}

function isDSManyArray(o) {
  return !!(o && isArray(o) && o instanceof DS.ManyArray);
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
