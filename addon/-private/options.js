import EmberObject, { get } from '@ember/object';
import ObjectProxy from '@ember/object/proxy';

const { keys } = Object;
const OPTION_KEYS = '__option_keys__';

const OptionsProxy = ObjectProxy.extend({
  toObject() {
    return this[OPTION_KEYS].reduce((obj, key) => {
      obj[key] = get(this, key);
      return obj;
    }, {});
  }
});

export default class Options {
  constructor({ model, attribute, options = {} }) {
    return OptionsProxy.create({
      [OPTION_KEYS]: keys(options),
      content: EmberObject.extend(options).create({ model, attribute })
    });
  }
}
