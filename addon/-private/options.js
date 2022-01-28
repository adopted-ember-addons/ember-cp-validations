import { tracked } from '@glimmer/tracking';

export default class Options {
  @tracked model;
  @tracked attribute;

  constructor(
    model,
    attribute,
    options = {},
    defaultOptions = {},
    globalOptions = {}
  ) {
    Object.assign(this, {
      model,
      attribute,
    });

    for (const source of [globalOptions, defaultOptions, options]) {
      const props = Object.keys(source);
      for (const prop of props) {
        const descriptor = Object.getOwnPropertyDescriptor(source, prop);
        Object.defineProperty(this, prop, descriptor);
      }
    }
  }

  toObject() {
    // eslint-disable-next-line no-unused-vars
    const { model, attribute, ...options } = this;
    return options;
  }
}
