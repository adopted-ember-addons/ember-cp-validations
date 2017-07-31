/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

/* eslint-env node */
'use strict';

module.exports = {
  name: 'ember-cp-validations',

  setupPreprocessorRegistry: function(type, registry) {
    var VGet = require('./htmlbars-plugins/v-get');

    registry.add('htmlbars-ast-plugin', {
      name: 'v-get',
      plugin: VGet,
      baseDir: function() {
        return __dirname;
      }
    });
  }
};
