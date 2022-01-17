import { buildValidations } from 'ember-cp-validations';

export default function (context, Validations, properties = {}) {
  @buildValidations(Validations)
  class ObjClass {}

  const obj = new ObjClass();
  Object.assign(obj, context.owner.ownerInjection(), properties);
  return obj;
}
