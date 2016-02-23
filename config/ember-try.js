/**
 * Copyright 2016, Yahoo! Inc.
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
    name: 'ember-2.0',
    dependencies: {
      ember: '~2.0.0',
      'ember-data': '~2.0.0'
    }
  }, {
    name: 'ember-2.1',
    dependencies: {
      ember: '~2.1.0',
      'ember-data': '~2.1.0'
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
      'ember': 'components/ember#release',
      'ember-data': 'components/ember-data#release'
    },
    resolutions: {
      'ember': 'release',
      'ember-data': 'release'
    }
  }, {
    name: 'ember-beta',
    dependencies: {
      'ember': 'components/ember#beta',
      'ember-data': 'components/ember-data#beta'
    },
    resolutions: {
      'ember': 'beta',
      'ember-data': 'beta'
    }
  }, {
    name: 'ember-canary',
    dependencies: {
      'ember': 'components/ember#canary',
      'ember-data': 'components/ember-data#canary'
    },
    resolutions: {
      'ember': 'canary',
      'ember-data': 'canary'
    }
  }]
};
