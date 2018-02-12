import { getOwner } from '@ember/application';

export default function(context, obj, options = {}) {
  return obj.create(getOwner(context).ownerInjection(), options);
}
