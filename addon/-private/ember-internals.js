import Ember from 'ember';
import { A } from '@ember/array';

let __EMBER_METAL__;
let emberMetalPaths = [
  '@ember/-internals/metal', // ember-source from 3.10
  '@ember/-internals/metal/index', // ember-source from 3.13
];
let metalPath = A(emberMetalPaths).find(
  (path) => Ember.__loader.registry[path]
);
if (metalPath) {
  __EMBER_METAL__ = Ember.__loader.require(metalPath);
}

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
