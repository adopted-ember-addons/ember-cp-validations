/* global requirejs, Ember, require */

/**
 * Registers the get helper created by the ember-get-helper addon if it is available. Since
 * this addon has been depricated for Ember > 2.0.0-beta.1 and replaced with the one included in Ember
 * this check must be done so tests dont fail on invalid import statements.
 *
 * Provided by @rwjblue
 */

import Helper from '@ember/component/helper';

function requireIfAvailable(moduleName, exportName = 'default') {
  if (requirejs.entries[moduleName]) {
    return require(moduleName)[exportName];
  }
}

let registerHelper = requireIfAvailable('ember-get-helper/utils/register-helper', 'registerHelper');
let getHelper = requireIfAvailable('ember-get-helper/helpers/get');
let getHelperGlimmer = requireIfAvailable('ember-get-helper/helpers/get-glimmer');

if (registerHelper) {
  if (Helper) {
    registerHelper('get', getHelperGlimmer);
  } else {
    registerHelper('get', getHelper);
  }
}
