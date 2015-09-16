var VersionChecker = require('ember-cli-version-checker');
var RSVP = require('rsvp');

module.exports = {
  normalizeEntityName: function() {},

  afterInstall: function() {
    var checker = new VersionChecker(this);
    var emberDep = checker.for('ember', 'bower');
    var dependencies = [
      this.addAddonToProject('ember-moment', '3.6.2')
    ];

    if (!emberDep.isAbove('2.0.0-beta.1')) {
      dependencies.push(this.addAddonToProject('ember-get-helper', '1.0.1'));
    }

    return RSVP.all(dependencies);
  }
};
