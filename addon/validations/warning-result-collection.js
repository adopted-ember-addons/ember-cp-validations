import ResultCollection from './result-collection';
import cycleBreaker from '../utils/cycle-breaker';
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
    return cycleBreaker(() =>
      emberArray([this.getEach('messages'), this.getEach('warningMessages')])
        .flat(Infinity)
        .compact()
        .uniq()
    );
  }

  get warnings() {
    return cycleBreaker(() =>
      this._computeErrorCollection(
        [this.getEach('errors'), this.getEach('warnings')].flat(Infinity)
      )
    );
  }
}
