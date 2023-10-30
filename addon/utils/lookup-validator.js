/**
 * Lookup a validator of a specific type on the owner
 *
 * @param  {Ember.Owner} owner
 * @param  {String} type
 * @throws {Error} Validator not found
 * @return {Class} Validator class
 */
export default function lookupValidator(owner, type) {
  if (!owner) {
    throw new Error(
      `[ember-cp-validations] \`lookupValidator\` requires owner/container access.`,
    );
  }

  const validatorClass = owner.factoryFor(`validator:${type}`);

  if (!validatorClass) {
    throw new Error(
      `[ember-cp-validations] Validator not found of type: ${type}.`,
    );
  }

  return validatorClass;
}
