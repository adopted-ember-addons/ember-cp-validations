import { isClassicDecorator, descriptorForDecorator,  } from '@ember/-internals/metal';

export function getDependentKeys(descriptorOrDecorator) {
  if (descriptorForDecorator) {
    let descriptor = descriptorForDecorator(
      descriptorOrDecorator
    );
    return descriptor._dependentKeys || [descriptor.altKey];
  } else {
    return descriptorOrDecorator._dependentKeys;
  }
}

export function isDescriptor(o) {
  if (isClassicDecorator) {
    return isClassicDecorator(o);
  } else {
    return (
      o && (typeof o === 'object' || typeof o === 'function') && o.isDescriptor
    );
  }
}
