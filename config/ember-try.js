/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
/*jshint node:true*/
module.exports = {
  command: 'ember test',
  scenarios: [{
    name: 'default',
    bower: {
      dependencies: {}
    }
  }, {
    name: 'ember-1.11',
    bower: {
      dependencies: {
        ember: '~1.11.0',
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
        ember: '~1.12.0',
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
        ember: '~1.13.0',
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
    name: 'ember-2.0',
    bower: {
      dependencies: {
        ember: '~2.0.0',
        'ember-data': '~2.0.0',
        'ember-cli-shims': '0.0.6'
      }
    }
  }, {
    name: 'ember-2.1',
    bower: {
      dependencies: {
        ember: '~2.1.0',
        'ember-data': '~2.1.0',
        'ember-cli-shims': '0.0.6'
      }
    }
  }, {
    name: 'ember-2.2',
    bower: {
      dependencies: {
        ember: '~2.2.0',
        'ember-data': '~2.2.0',
        'ember-cli-shims': '0.0.6'
      }
    }
  }, {
    name: 'ember-2.3',
    bower: {
      dependencies: {
        ember: '~2.3.0',
        'ember-data': '~2.3.0'
      }
    }
  }, {
    name: 'ember-release',
    bower: {
      dependencies: {
        'ember': 'components/ember#release',
        'ember-data': 'components/ember-data#release'
      },
      resolutions: {
        'ember': 'release',
        'ember-data': 'release'
      }
    }
  }, {
    name: 'ember-beta',
    bower: {
      dependencies: {
        'ember': 'components/ember#beta',
        'ember-data': 'components/ember-data#beta'
      },
      resolutions: {
        'ember': 'beta',
        'ember-data': 'beta'
      }
    }
  }, {
    name: 'ember-canary',
    bower: {
      dependencies: {
        'ember': 'components/ember#canary',
        'ember-data': 'components/ember-data#canary'
      },
      resolutions: {
        'ember': 'canary',
        'ember-data': 'canary'
      }
    }
  }]
};
