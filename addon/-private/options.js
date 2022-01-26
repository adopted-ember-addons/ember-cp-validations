import { tracked } from '@glimmer/tracking';

function applyProps(target, ...sources) {
  for (const source of sources) {
    const props = Object.keys(source);
    for (const prop of props) {
      const descriptor = Object.getOwnPropertyDescriptor(source, prop);
      Object.defineProperty(target, prop, descriptor);
    }
  }
}

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

    applyProps(this, globalOptions, defaultOptions, options);
  }

  toObject() {
    let obj = {
      model: this.model,
      attribute: this.attribute,
    };
    applyProps(obj, this);
    return obj;
  }
}
