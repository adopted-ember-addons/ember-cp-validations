var VersionChecker = require('ember-cli-version-checker');

module.exports = {
  normalizeEntityName: function() {},

  afterInstall: function() {
    var checker = new VersionChecker(this);
    var emberDep = checker.forEmber();

    if (!emberDep.isAbove('2.0.0-beta.1')) {
      return this.addAddonToProject('ember-get-helper', '1.0.1');
    }
  }
};
