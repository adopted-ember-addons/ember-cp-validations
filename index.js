'use strict';

module.exports = {
  name: require('./package').name,

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
