'use strict';

const path = require('path');

module.exports = {
  description: 'Generates a validator unit test',

  filesPath() {
    const dependencies = this.project.dependencies();
    let type;

    if ('ember-mocha' in dependencies || 'ember-cli-mocha' in dependencies) {
      type = 'mocha';
    } else if ('ember-cli-qunit' in dependencies) {
      type = 'qunit';
    } else {
      this.ui.writeLine("Couldn't determine test style - using QUnit");
      type = 'qunit';
    }

    return path.join(this.path, type + '-files');
  },

  // workaround https://github.com/ember-cli/ember-cli/issues/5481
  supportsAddon() {
    return false;
  }
};
