import Ember from 'ember';

const {
  getOwner
} = Ember;

export default function(context, obj, options = {}) {
  return obj.create(getOwner(context).ownerInjection(), options);
}
