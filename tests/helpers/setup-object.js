import Ember from 'ember';

export default function(context, obj, options = {}) {
  if(Ember.setOwner && Ember.getOwner) {
    Ember.setOwner(options, Ember.getOwner(context));
  } else {
    options.container = context.container;
  }
  return obj.create(options);
}
