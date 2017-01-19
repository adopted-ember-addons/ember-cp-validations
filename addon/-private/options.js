import Ember from 'ember';
import { isDescriptor } from 'ember-cp-validations/utils/utils';

const {
  get,
  set,
  defineProperty
} = Ember;

const Options = Ember.Object.extend({
  model: null,
  attribute: null,

  // Private
  __options__: null,

  init() {
    this._super(...arguments);

    let options = this.get('__options__');

    Object.keys(options).forEach((key) => {
      let value = options[key];

      if (isDescriptor(value)) {
        defineProperty(this, key, value);
      } else {
        set(this, key, value);
      }
    });
  },

  copy(deep) {
    let options = this.get('__options__');

    if (deep) {
      return Options.create({
        model: get(this, 'model'),
        attribute: get(this, 'attribute'),
        __options__: options
      });
    }

    return Ember.Object.create(Object.keys(options).reduce((obj, o) => {
      obj[o] = get(this, o);
      return obj;
    }, {}));
  }
});

export default Options;
