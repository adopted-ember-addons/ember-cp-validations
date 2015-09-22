import Ember from 'ember';

export default Ember.Object.extend({
  registry: null,
  container: null,

  init() {
    this._super(...arguments);
    this.makeContainer();
  },

  register(fullName, factory) {
    var {
      registry, container
    } = this.getProperties(['registry', 'container']);

    (registry || container).register(fullName, factory);
  },

  makeContainer() {
    var registry, container;

    if (Ember.Registry) {
      // new ember post container/registry refrom
      registry = new Ember.Registry();
      container = registry.container();
    } else {
      // pre container/registry reform=
      container = new Ember.Container();
    }

    this.setProperties({
      registry, container
    });
  }
});
