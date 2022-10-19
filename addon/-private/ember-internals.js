export function getDependentKeys(descriptorOrDecorator) {
  let descriptor = descriptorForDecorator(descriptorOrDecorator);
  return descriptor._dependentKeys || [descriptor.altKey];
}

export function isDescriptor(o) {
  return isClassicDecorator(o);
}

// Brought over from Ember, because Embroider won't play ball with importing from internals
// https://github.com/emberjs/ember.js/blob/16136bfcb6a0242d9c55ca7023ab8ea317167c71/packages/%40ember/-internals/metal/lib/decorator.ts

const DECORATOR_DESCRIPTOR_MAP = new WeakMap();

function isClassicDecorator(dec) {
  return typeof dec === 'function' && DECORATOR_DESCRIPTOR_MAP.has(dec);
}

function descriptorForDecorator(dec) {
  return DECORATOR_DESCRIPTOR_MAP.get(dec);
}
