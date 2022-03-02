import ResultCollection from './result-collection';
import { A as emberArray } from '@ember/array';
import { dependentKeyCompat } from '@ember/object/compat';

export default class WarningResultCollection extends ResultCollection {
  @dependentKeyCompat
  get isValid() {
    return true;
  }

  @dependentKeyCompat
  get messages() {
    return [];
  }

  @dependentKeyCompat
  get errors() {
    return [];
  }

  @dependentKeyCompat
  get warningMessages() {
    return emberArray([
      this.content.mapBy('messages'),
      this.content.mapBy('warningMessages'),
    ])
      .flat(Infinity)
      .compact()
      .uniq();
  }

  @dependentKeyCompat
  get warnings() {
    return this._computeErrorCollection(
      [this.content.mapBy('errors'), this.content.mapBy('warnings')].flat(
        Infinity
      )
    );
  }
}
