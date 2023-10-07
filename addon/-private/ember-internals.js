import * as EMBER_METAL from '@ember/-internals/metal/index';

const POSSIBLE_DECORATORS = ['AliasDecoratorImpl', 'ComputedDecoratorImpl'];

export function getDependentKeys(descriptorOrDecorator) {
  if (EMBER_METAL && EMBER_METAL.descriptorForDecorator) {
    let descriptor = EMBER_METAL.descriptorForDecorator(descriptorOrDecorator);
    return descriptor._dependentKeys || [descriptor.altKey];
  } else {
    return descriptorOrDecorator._dependentKeys;
  }
}

export function isDescriptor(o) {
  const isClassicDecorator =
    EMBER_METAL &&
    EMBER_METAL.isClassicDecorator &&
    EMBER_METAL.isClassicDecorator(o);
  const _isDescriptor =
    o && (typeof o === 'object' || typeof o === 'function') && o.isDescriptor;
  const isOtherDecoratorImpl = POSSIBLE_DECORATORS.includes(
    o?.constructor?.name,
  );
  return isClassicDecorator || _isDescriptor || isOtherDecoratorImpl;
}
