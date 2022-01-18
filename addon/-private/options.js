import { tracked } from '@glimmer/tracking';

const OPTION_KEYS = '__option_keys__';

export default class Options {
  @tracked model;
  @tracked attribute;
  [OPTION_KEYS];

  constructor({ model, attribute, options = {} }) {
    Object.assign(this, {
      [OPTION_KEYS]: Object.keys(options),
      model,
      attribute,
      ...options,
    });
  }

  toObject() {
    return this[OPTION_KEYS].reduce((obj, key) => {
      obj[key] = this[key];
      return obj;
    }, {});
  }
}
