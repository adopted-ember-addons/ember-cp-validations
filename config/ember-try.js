/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

module.exports = {
  scenarios: [{
    name: 'default',
    dependencies: {}
  }, {
    name: 'ember-1.10',
    dependencies: {
      ember: '~1.10.0',
      'ember-data': '~1.13.0'
    }
  }, {
    name: 'ember-1.11',
    dependencies: {
      ember: '~1.11.0',
      'ember-data': '~1.13.0'
    }
  }, {
    name: 'ember-1.12',
    dependencies: {
      ember: '~1.12.0',
      'ember-data': '~1.13.0'
    }
  }, {
    name: 'ember-1.13',
    dependencies: {
      ember: '~1.13.0',
      'ember-data': '~1.13.0'
    }
  }, {
    name: 'ember-release',
    dependencies: {
      'ember': 'components/ember#release'
    },
    resolutions: {
      'ember': 'release'
    }
  }, {
    name: 'ember-beta',
    dependencies: {
      'ember': 'components/ember#beta'
    },
    resolutions: {
      'ember': 'beta'
    }
  }, {
    name: 'ember-canary',
    dependencies: {
      'ember': 'components/ember#canary'
    },
    resolutions: {
      'ember': 'canary'
    }
  }]
};
