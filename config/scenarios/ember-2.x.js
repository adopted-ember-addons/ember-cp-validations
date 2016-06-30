/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
/*jshint node:true*/
module.exports = {
  command: 'ember test --reporter tap',

  npmOptions: ['--loglevel=silent'],

  scenarios: [{
    name: 'ember-2.0',
    bower: {
      dependencies: {
        'ember': '~2.0.0',
        'ember-data': '~2.0.0',
        'ember-cli-shims': '0.0.6'
      }
    }
  }, {
    name: 'ember-2.1',
    bower: {
      dependencies: {
        'ember': '~2.1.0',
        'ember-data': '~2.1.0',
        'ember-cli-shims': '0.0.6'
      }
    }
  }, {
    name: 'ember-2.2',
    bower: {
      dependencies: {
        'ember': '~2.2.0',
        'ember-data': '~2.2.0',
        'ember-cli-shims': '0.0.6'
      }
    }
  }, {
    name: 'ember-2.3',
    npm: {
      devDependencies: {
        'ember-data': '2.3.0'
      }
    },
    bower: {
      dependencies: {
        'ember': '~2.3.0'
      }
    }
  }, {
    name: 'ember-2.4',
    npm: {
      devDependencies: {
        'ember-data': '2.4.0'
      }
    },
    bower: {
      dependencies: {
        'ember': '~2.4.0'
      }
    }
  }, {
    name: 'ember-2.5',
    npm: {
      devDependencies: {
        'ember-data': '2.5.0'
      }
    },
    bower: {
      dependencies: {
        'ember': '~2.5.0'
      }
    }
  }, {
    name: 'ember-2.6',
    npm: {
      devDependencies: {
        'ember-data': '2.6.0'
      }
    },
    bower: {
      dependencies: {
        'ember': '~2.6.0'
      }
    }
  }]
};
