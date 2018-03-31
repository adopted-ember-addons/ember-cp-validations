export default function(context, obj, options = {}) {
  return obj.create(context.owner.ownerInjection(), options);
}
