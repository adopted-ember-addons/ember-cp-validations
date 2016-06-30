/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
/*jshint node:true*/
module.exports = {
  command: 'ember test --reporter tap',

  npmOptions: ['--loglevel=silent'],

  scenarios: [{
    name: 'ember-1.11',
    bower: {
      dependencies: {
        'ember': '~1.11.0',
        'ember-data': '~1.13.0',
        'ember-cli-shims': '0.0.6'
      }
    },
    npm: {
      dependencies: {
        'ember-get-helper': '^1.0.4',
      }
    }
  }, {
    name: 'ember-1.12',
    bower: {
      dependencies: {
        'ember': '~1.12.0',
        'ember-data': '~1.13.0',
        'ember-cli-shims': '0.0.6'
      }
    },
    npm: {
      dependencies: {
        'ember-get-helper': '^1.0.4',
      }
    }
  }, {
    name: 'ember-1.13',
    bower: {
      dependencies: {
        'ember': '~1.13.0',
        'ember-data': '~1.13.0',
        'ember-cli-shims': '0.0.6'
      }
    },
    npm: {
      dependencies: {
        'ember-get-helper': '^1.0.4',
      }
    }
  }]
};
