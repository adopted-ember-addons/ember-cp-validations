import ResultCollection from './result-collection';
import { A as emberArray } from '@ember/array';

export default class WarningResultCollection extends ResultCollection {
  get isValid() {
    return true;
  }

  get isTruelyValid() {
    return !this.isValidating;
  }

  get messages() {
    return [];
  }

  get errors() {
    return [];
  }

  get warningMessages() {
    return emberArray([
      this.content.mapBy('messages'),
      this.content.mapBy('warningMessages'),
    ])
      .flat(Infinity)
      .compact()
      .uniq();
  }

  get warnings() {
    return this._computeErrorCollection(
      [this.content.mapBy('errors'), this.content.mapBy('warnings')].flat(
        Infinity
      )
    );
  }
}
