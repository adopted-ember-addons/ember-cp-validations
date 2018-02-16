import EmberObject, { get } from '@ember/object';
import { isDescriptor } from '../utils/utils';

const { keys } = Object;
const OPTION_KEYS = '__option_keys__';

const OptionsObject = EmberObject.extend({
  toObject() {
    return this[OPTION_KEYS].reduce((obj, key) => {
      obj[key] = get(this, key);
      return obj;
    }, {});
  }
});

export default class Options {
  constructor({ model, attribute, options = {} }) {
    const optionKeys = keys(options);
    const createParams = { [OPTION_KEYS]: optionKeys, model, attribute };

    // If any of the options is a CP, we need to create a custom class for it
    if (optionKeys.some(key => isDescriptor(options[key]))) {
      return OptionsObject.extend(options).create(createParams);
    }

    return OptionsObject.create(createParams, options);
  }
}
