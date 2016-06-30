/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
/*jshint node:true*/
module.exports = {
  command: 'ember test --reporter tap',

  npmOptions: ['--loglevel=silent'],

  scenarios: [{
    name: 'ember-release',
    npm: {
      devDependencies: {
        'ember-data': 'components/ember-data#release'
      }
    },
    bower: {
      dependencies: {
        'ember': 'components/ember#release'
      },
      resolutions: {
        'ember': 'release'
      }
    }
  }, {
    name: 'ember-beta',
    allowedToFail: true,
    npm: {
      devDependencies: {
        'ember-data': 'components/ember-data#beta'
      }
    },
    bower: {
      dependencies: {
        'ember': 'components/ember#beta'
      },
      resolutions: {
        'ember': 'beta'
      }
    }
  }, {
    name: 'ember-canary',
    allowedToFail: true,
    npm: {
      devDependencies: {
        'ember-data': 'components/ember-data#canary'
      }
    },
    bower: {
      dependencies: {
        'ember': 'components/ember#canary'
      },
      resolutions: {
        'ember': 'canary'
      }
    }
  }]
};
