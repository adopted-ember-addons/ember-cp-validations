/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

/* eslint-env node */
'use strict';

module.exports = {
  name: 'ember-cp-validations',

  setupPreprocessorRegistry: function(type, registry) {
    let plugin = this._buildPlugin();

    plugin.parallelBabel = {
      requireFile: __filename,
      buildUsing: '_buildPlugin',
      params: {},
    };

    registry.add('htmlbars-ast-plugin', plugin);
  },

  _buildPlugin() {
    var VGet = require('./htmlbars-plugins/v-get');

    return {
      name: 'v-get',
      plugin: VGet,
      baseDir: function() {
        return __dirname;
      }
    };
  },
};
