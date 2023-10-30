import {
  isClassicDecorator,
  descriptorForDecorator,
} from '@ember/-internals/metal/index';

export function getDependentKeys(descriptorOrDecorator) {
  const descriptor = descriptorForDecorator(descriptorOrDecorator);
  // TODO: Figure out why the fallback `|| [descriptor.altKey]` is needed
  return descriptor._dependentKeys || [descriptor.altKey];
}

// New decorator implementations that are not detected by isClassicDecorator()
// TODO: Figure out if there is an alternative to isClassicDecorator + this exceptions
const DECORATOR_IMPLEMENTATIONS = [
  'AliasDecoratorImpl',
  'ComputedDecoratorImpl',
];

export function isDescriptor(o) {
  return (
    isClassicDecorator(o) ||
    DECORATOR_IMPLEMENTATIONS.includes(o?.constructor?.name)
  );
}
