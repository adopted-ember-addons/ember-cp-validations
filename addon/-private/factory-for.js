/**
  Utility to use `ApplicationInstance#factoryFor` if available (2.12+) and
  fallback to private `_lookupFactory` otherwise
*/
export default function factoryFor(owner, type) {
  let factory;
  if (owner.factoryFor) {
    let maybeFactory = owner.factoryFor(type);
    factory = maybeFactory && maybeFactory.class;
  } else {
    factory = owner._lookupFactory(type);
  }
  return factory;
}