import { tracked } from '@glimmer/tracking';

export default class Options {
  @tracked model;
  @tracked attribute;
  __OPTION_KEYS__;

  constructor({ model, attribute, options = {} }) {
    Object.assign(this, {
      __OPTION_KEYS__: Object.keys(options),
      model,
      attribute,
      ...options,
    });
  }

  toObject() {
    return this.__OPTION_KEYS__.reduce((obj, key) => {
      obj[key] = this[key];
      return obj;
    }, {});
  }
}
