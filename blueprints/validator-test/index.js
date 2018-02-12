var path = require('path');
var fs = require('fs');
var VersionChecker = require('ember-cli-version-checker');

module.exports = {
  description: 'Generates a validator unit test',

  filesPath() {
    var type;

    if ('ember-cli-mocha' in this.project.addonPackages) {
      // Thank you @Turbo87 https://github.com/emberjs/ember.js/pull/14670
      var checker = new VersionChecker({ project: this.project });
      if (fs.existsSync(this.path + '/mocha-0.12-files') && checker.for('ember-cli-mocha', 'npm').satisfies('>=0.12.0')) {
        type = 'mocha-0.12';
      } else {
        type = 'mocha';
      }
    } else if ('ember-cli-qunit' in this.project.addonPackages) {
      type = 'qunit';
    } else {
      this.ui.writeLine('Couldn\'t determine test style - using QUnit');
      type = 'qunit';
    }
    return path.join(this.path, type + '-files');
  },

  // workaround https://github.com/ember-cli/ember-cli/issues/5481
  supportsAddon() {
    return false;
  },
};
