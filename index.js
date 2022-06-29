'use strict';

module.exports = {
  name: require('./package').name,

  setupPreprocessorRegistry: function (type, registry) {
    registry.add('htmlbars-ast-plugin', this._buildPlugin());
  },

  _buildPlugin() {
    const vGetPlugin = require('./htmlbars-plugins/v-get');

    return {
      name: 'v-get',
      baseDir: function () {
        return __dirname;
      },
      parallelBabel: {
        requireFile: __filename,
        buildUsing: '_buildPlugin',
        params: {},
      },
      plugin: vGetPlugin,
    };
  },
};
