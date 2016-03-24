import getOwner from 'ember-getowner-polyfill';

export default function(context, obj, options = {}) {
  return obj.create(getOwner(context).ownerInjection(), options);
}
