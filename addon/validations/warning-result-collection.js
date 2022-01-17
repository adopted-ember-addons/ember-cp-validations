import ResultCollection from './result-collection';
import cycleBreaker from '../utils/cycle-breaker';
import { uniq, compact } from '../utils/array';

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
    return cycleBreaker(function () {
      return uniq(
        compact(
          [this.getEach('messages'), this.getEach('warningMessages')].flat(
            Infinity
          )
        )
      );
    });
  }

  get warnings() {
    return cycleBreaker(function () {
      return this._computeErrorCollection(
        [this.getEach('errors'), this.getEach('warnings')].flat(Infinity)
      );
    });
  }
}
