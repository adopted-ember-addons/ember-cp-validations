/* global require */

// There does not seem to be a way to access the below module from under Embroider. Relying on the
// global `require` function is our best resort at the moment and is the recommended way to access
// these things by Ember Core members. It is similar what is being done in `ember-get-config`.
//
// https://github.com/mansona/ember-get-config/commit/5493d11ae92fff96f296697169a61fed412490c5
const __EMBER_METAL__ = require('@ember/-internals/metal/index');

export function getDependentKeys(descriptorOrDecorator) {
  if (__EMBER_METAL__ && __EMBER_METAL__.descriptorForDecorator) {
    let descriptor = __EMBER_METAL__.descriptorForDecorator(
      descriptorOrDecorator
    );
    return descriptor._dependentKeys || [descriptor.altKey];
  } else {
    return descriptorOrDecorator._dependentKeys;
  }
}

export function isDescriptor(o) {
  if (__EMBER_METAL__ && __EMBER_METAL__.isClassicDecorator) {
    return __EMBER_METAL__.isClassicDecorator(o);
  } else {
    return (
      o && (typeof o === 'object' || typeof o === 'function') && o.isDescriptor
    );
  }
}
