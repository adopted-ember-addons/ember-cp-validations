import __EMBER_METAL__ from '@ember/-internals/metal/index';

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
