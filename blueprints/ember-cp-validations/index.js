var RSVP = require('rsvp');

module.exports = {
  normalizeEntityName: function() {},

  afterInstall: function() {
    return RSVP.all([
      this.addAddonToProject('ember-lodash', '0.0.5'),
      this.addAddonToProject('ember-moment', '3.2.1')
    ]);
  }
};
