var path = require('path');

var existsSync = require('exists-sync');
var walkSync = require('walk-sync');

module.exports = {
  description: 'Generates a validator unit test',

  init: function() {
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
      type = 'mocha';
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
  }
};
