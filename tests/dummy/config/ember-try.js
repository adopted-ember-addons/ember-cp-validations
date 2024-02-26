'use strict';

const getChannelURL = require('ember-source-channel-url');
const { embroiderSafe, embroiderOptimized } = require('@embroider/test-setup');

module.exports = async function () {
  return {
    usePnpm: true,
    scenarios: [
      {
        name: 'ember-lts-3.28',
        npm: {
          devDependencies: {
            'ember-source': '~3.28.0',
            'ember-data': '~3.28.0',
          },
        },
      },
      {
        name: 'ember-4.0',
        npm: {
          devDependencies: {
            'ember-source': '~4.0.0',
            'ember-data': '~4.0.0',
          },
        },
      },
      {
        name: 'ember-lts-4.4',
        npm: {
          devDependencies: {
            'ember-source': '~4.4.0',
            'ember-data': '~4.4.0',
          },
        },
      },
      {
        name: 'ember-lts-4.8',
        npm: {
          devDependencies: {
            'ember-source': '~4.8.0',
            'ember-data': '~4.8.0',
          },
        },
      },
      {
        name: 'ember-release',
        npm: {
          devDependencies: {
            '@ember/string': '3.0.1',
            'ember-source': await getChannelURL('release'),
            'ember-data': 'latest',
          },
        },
      },
      {
        name: 'ember-beta',
        npm: {
          devDependencies: {
            '@ember/string': '3.0.1',
            'ember-source': await getChannelURL('beta'),
            'ember-data': 'beta',
          },
        },
      },
      {
        name: 'ember-canary',
        npm: {
          devDependencies: {
            '@ember/string': '3.0.1',
            'ember-source': await getChannelURL('canary'),
            'ember-data': 'canary',
          },
        },
      },
      embroiderSafe(),
      embroiderOptimized(),
    ],
  };
};
