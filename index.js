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
