import {
  isClassicDecorator,
  descriptorForDecorator,
} from '@ember/-internals/metal/index';

export function getDependentKeys(descriptorOrDecorator) {
  const descriptor = descriptorForDecorator(descriptorOrDecorator);
  // TODO: Figure out why the fallback `|| [descriptor.altKey]` is needed
  return descriptor._dependentKeys || [descriptor.altKey];
}

export function isDescriptor(o) {
  return isClassicDecorator(o);
}
