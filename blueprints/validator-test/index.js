var path = require('path');
var fs = require('fs');

var VersionChecker = require('ember-cli-version-checker');
var existsSync = require('exists-sync');
var walkSync = require('walk-sync');

module.exports = {
  description: 'Generates a validator unit test',

  init: function() {
    if(this._super.init) {
      this._super.init.apply(this, arguments);
    }

    if (!this.filesPath) {
      this.files = this._legacyEmberCLIFilesOverride;
      this.srcPath = this._legacySrcPathOverride;
    } else {
      this.filesPath = this._filesPath;
    }
  },

  _filesPath: function() {
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

  // The files and srcPath method can be removed once
  // https://github.com/ember-cli/ember-cli/pull/4837 is live.
  // Also, remove the npm dependencies on walk-sync and exists-sync when fixing.
  _legacyEmberCLIFilesOverride: function() {
    if (this._files) { return this._files; }

    var filesPath = this._filesPath();

    if (existsSync(filesPath)) {
      this._files = walkSync(filesPath);
    } else {
      this._files = [];
    }

    return this._files;
  },

  _legacySrcPathOverride: function(file) {
    return path.resolve(this._filesPath(), file);
  },

  // workaround https://github.com/ember-cli/ember-cli/issues/5481
  supportsAddon: function() {
    return false;
  },
};
